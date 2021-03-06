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
  limit: 6;
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
      tag: [''],
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
  modelChangeFn(e){
    const text = this.transform(e);
    this.blogs.patchValue({slug: text});
  }

  // Handle slug
  transform(value) {
    let text = value.toLowerCase();
    // --------------------------
    // ?????i k?? t??? c?? d???u th??nh kh??ng d???u
    text = text.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'a');
    text = text.replace(/??|??|???|???|???|??|???|???|???|???|???/gi, 'e');
    text = text.replace(/i|??|??|???|??|???/gi, 'i');
    text = text.replace(/??|??|???|??|???|??|???|???|???|???|???|??|???|???|???|???|???/gi, 'o');
    text = text.replace(/??|??|???|??|???|??|???|???|???|???|???/gi, 'u');
    text = text.replace(/??|???|???|???|???/gi, 'y');
    text = text.replace(/??/gi, 'd');
    // X??a c??c k?? t??? ?????t bi???t
    text = text.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // ?????i kho???ng tr???ng th??nh k?? t??? g???ch ngang
    text = text.replace(/ /gi, '-');
    // ?????i nhi???u k?? t??? g???ch ngang li??n ti???p th??nh 1 k?? t??? g???ch ngang
    // Ph??ng tr?????ng h???p ng?????i nh???p v??o qu?? nhi???u k?? t??? tr???ng
    text = text.replace(/\-\-\-\-\-/gi, '-');
    text = text.replace(/\-\-\-\-/gi, '-');
    text = text.replace(/\-\-\-/gi, '-');
    text = text.replace(/\-\-/gi, '-');
    // X??a c??c k?? t??? g???ch ngang ??? ?????u v?? cu???i
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
            thumbnail: res['filename'],
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
              this.toastrService.success('Th??m m???i th??nh c??ng!');
            },
            (error) => {
              // this.toastrService.error('Th??m m???i th???t b???i!');
              this.toastrService.error(error.error.message);

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
    this.blogCategoriesService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.blogCategoriesService.getAll(this.limit)
            .subscribe(
              res => {
                this.blogCategories = res['rows'];
              });
        },
        error => {
          console.log(error);
        });
  }
}
