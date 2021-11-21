import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../../../../services/blogs.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import { environment } from '../../../../../environments/environment';

import './create-blog.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  result = false;
  images = null;
  submitted = false;
  blogs: FormGroup;
  error = '';
  blogCategories?: BlogCategories[];
  showImg: '';
  constructor(private blogsService: BlogsService,
              public fb: FormBuilder,
              private http: HttpClient,
              private toastrService: ToastrService,
              private _router: Router,
              private blogCategoriesService: BlogCategoriesService,
  ) {
    // Reactive Form
    this.blogs = this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      slug: ['', Validators.compose([Validators.required])],
      thumbnail: ['', Validators.compose([Validators.required])],
      summary: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      tag: ['', Validators.compose([Validators.required])],
      status: ['1'],
      blogCategoryId: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.retrieveBlogCategories();
  }
  get f() {
    return this.blogs.controls;
  }
  // Create slug
  modelChangeFn(e) {
    const text = this.transform(e);
    this.blogs.patchValue({slug: text});
  }

  // Handle slug
  transform(value) {
    let text = value.toLowerCase();
    // --------------------------
    // Đổi ký tự có dấu thành không dấu
    text = text.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    text = text.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    text = text.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    text = text.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    text = text.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    text = text.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    text = text.replace(/đ/gi, 'd');
    // Xóa các ký tự đặt biệt
    text = text.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // Đổi khoảng trắng thành ký tự gạch ngang
    text = text.replace(/ /gi, '-');
    // Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    // Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    text = text.replace(/\-\-\-\-\-/gi, '-');
    text = text.replace(/\-\-\-\-/gi, '-');
    text = text.replace(/\-\-\-/gi, '-');
    text = text.replace(/\-\-/gi, '-');
    // Xóa các ký tự gạch ngang ở đầu và cuối
    text = '@' + text + '@';
    text = text.replace(/\@\-|\-\@|\@/gi, '');

    return text;
  }

  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.blogs.patchValue({
      thumbnail: file,
    });
    this.blogs.get('thumbnail').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      // this.showImg = reader.result as string;
      this.blogs.patchValue({
        thumbnail: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  // Create blog
  saveBlog(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    this.submitted = true;

    // return validators
    if (this.blogs.invalid) {
      return false;
    }
    this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            title: this.blogs.value['title'],
            slug: this.blogs.value['slug'],
            thumbnail: environment.linkImg+res['filename'],
            summary: this.blogs.value['summary'],
            description: this.blogs.value['description'],
            tag: JSON.stringify(this.blogs.value['tag']),
            status: this.blogs.value['status'],
            blog_category_id: this.blogs.value['blogCategoryId'],
            admin_id: localStorage.getItem('id'),
          };
          this.blogsService.create(data).subscribe(
            (response) => {
              this.submitted = true;
              this.newBlog();
              this.toastrService.success('Thêm mới thành công!');
            },
            (error) => {
              this.toastrService.success('Thêm mới thất bại!');
            });
        }
      });
  }

  newBlog(): void {
    this.submitted = false;
    this.images = null;
    this.blogs = this.fb.group({
      title: [''],
      slug: [''],
      thumbnail: [null],
      summary: [''],
      description: [''],
      tag: [''],
      status: ['1'],
      blogCategoryId: [''],
    });
  }

  retrieveBlogCategories(): void {
    this.blogCategoriesService.getAll()
      .subscribe(
        data => {
          this.blogCategories = data['rows'];
        },
        error => {
          console.log(error);
        });
  }
}
