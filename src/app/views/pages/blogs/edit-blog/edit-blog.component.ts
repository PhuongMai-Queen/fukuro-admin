import { Component, OnInit } from '@angular/core';
import { Blogs } from '../../../../models/blogs.model';
import { BlogsService } from '../../../../services/blogs.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router, ActivatedRoute} from '@angular/router';
import {BlogCategories} from '../../../../models/blog-categories.model';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import { environment } from '../../../../../environments/environment';
import {Promotions} from '../../../../models/promotions.model';
import './edit-blog.loader';
import 'ckeditor';


@Component({
  selector: 'ngx-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
  result = false;
  images = null;
  submitted = false;
  error = '';
  promotions?: Promotions[];
  limit: 6;
  constructor(private blogsService: BlogsService,
              public fb: FormBuilder,
              private http: HttpClient,
              private toastrService: ToastrService,
              private _router: Router,
              private blogCategoriesService: BlogCategoriesService,
              private activatedRoute: ActivatedRoute,
  ) {}
  blogs = this.fb.group({
    title: [''],
    slug: [''],
    thumbnail: [''],
    summary: [''],
    description: [''],
    status: [''],
    blogCategoryId: [''],
    thumbnailCus: [''],
  });
  blogCategories?: BlogCategories[];
  id: null;
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getBlogs(this.id);
  }

  get f() {
    return this.blogs.controls;
  }

  getBlogs(id): void {
    this.blogsService.get(id)
      .subscribe(
        data => {
          this.blogs = this.fb.group({
            title: [data.title, Validators.compose([Validators.required])],
            slug: [data.slug, Validators.compose([Validators.required])],
            thumbnail: [environment.linkImg+data.thumbnail, Validators.compose([Validators.required])],
            summary: [data.summary, Validators.compose([Validators.required])],
            description: [data.description, Validators.compose([Validators.required])],
            status: [data.status],
            blogCategoryId: [data.blogCategoryId, Validators.compose([Validators.required])],
            thumbnailCus: [data.thumbnail],
          });
          this.retrieveBlogCategories(data.blogCategoryId);
        },
        error => {
          console.log(error);
        });
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
    if(this.images == null){
      const data = {
        title: this.blogs.value['title'],
        slug: this.blogs.value['slug'],
        thumbnail: this.blogs.value['thumbnailCus'],
        summary: this.blogs.value['summary'],
        description: this.blogs.value['description'],
        tag: JSON.stringify(this.blogs.value['tag']),
        status: this.blogs.value['status'],
        blogCategoryId: this.blogs.value['blogCategoryId'],
        adminId: localStorage.getItem('id'),
      };
      this.blogsService.update(this.id, data).subscribe(
        (response) => {
          this.retrieveBlogCategories(data.blogCategoryId);
          this.toastrService.success(response.message);
        },
        (error) => {
          this.toastrService.error('Thêm mới thất bại!');
        });
    }
    else{
      this.blogsService.get(this.id).toPromise().then(
        data => {
          const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              file_name: data.thumbnail,
            },
          };
          this.http.delete(environment.apiDeleteImg, options).subscribe();
        });
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
            blogCategoryId: this.blogs.value['blogCategoryId'],
            adminId: localStorage.getItem('id'),
          };
          this.blogsService.update(this.id, data).subscribe(
            (response) => {
              this.retrieveBlogCategories(data.blogCategoryId);
              this.toastrService.success(response.message);
            },
            (error) => {
              this.toastrService.error('Thêm mới thất bại!');
            });
        }
      });
    }
  }

  retrieveBlogCategories(blog_cate_id): void {
    this.blogCategoriesService.getAll(this.limit)
      .subscribe(
        data => {
          this.limit = data['count'];
          this.blogCategoriesService.getAll(this.limit)
            .subscribe(
              res => {
                const customData = res['rows'];
                const obj = [];
                customData.forEach((currentValue, index) => {
                  if(currentValue.id == blog_cate_id){
                    obj.push({ id: currentValue.id, name: currentValue.name });
                    customData.splice(index,1);
                  }
                });
                customData.forEach((currentValue, index) => {
                  obj.push({ id: currentValue.id, name: currentValue.name });
                });
                this.blogCategories = obj;
              });
        },
        error => {
          console.log(error);
        });
  }
}
