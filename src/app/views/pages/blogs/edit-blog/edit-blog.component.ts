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
          this.toastrService.error('Th??m m???i th???t b???i!');
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
              this.toastrService.error('Th??m m???i th???t b???i!');
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
