import { Component, OnInit } from '@angular/core';
import { Blogs } from '../../../../models/blogs.model';
import { BlogsService } from '../../../../services/blogs.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import './create-blog.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent implements OnInit {
  result = false;
  images;
  blogs: Blogs = {
    title: '',
    slug: '',
    thumbnail: '',
    summary: '',
    description: '',
    tag: '',
    status: '',
    customer_id: '1',
    blog_category_id: '',
  };
  submitted = false;
  uploadForm: FormGroup;
  constructor(private blogsService: BlogsService, public fb: FormBuilder, private http: HttpClient) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      thumbnail: [null],
      name: [''],
      title: [''],
      slug: [''],
    });
  }
  // constructor(private blogsService: BlogsService) {}

  ngOnInit() {}
  modelChangeFn(e) {
    const text = this.transform(e);
    this.blogs.slug = text;
      // setTimeout(() => {
      //   this.blogs.slug = text;
      // }, 2000);
  }

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

  saveBlog(): void {

    const formData = new FormData();
    formData.append('file', this.images);
    this.http.post('http://localhost:3000/file', formData).toPromise().then(res => {
      this.blogs.thumbnail = 'http://fukuro.local/img/'+res['filename'];
      this.result = true;
      if(this.result == true){
        const data = {
          title: this.blogs.title,
          slug: this.blogs.slug,
          thumbnail: this.blogs.thumbnail,
          summary: this.blogs.summary,
          description: this.blogs.description,
          tag: this.blogs.tag,
          status: this.blogs.status,
          customer_id: this.blogs.customer_id,
          blog_category_id: this.blogs.blog_category_id,
        };
        // console.log(data);
        this.blogsService.create(data).subscribe(
          (response) => {
            // console.log(response);
            this.submitted = true;
          },
          (error) => {
            // console.log(error);
          });
      }
    });
  }
  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      thumbnail: file,
    });
    this.uploadForm.get('thumbnail').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.blogs.thumbnail = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
