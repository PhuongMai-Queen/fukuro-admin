import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {BlogCategoriesService} from '../../../../services/blog-categories.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'ngx-create-blog-category',
  templateUrl: './create-blog-category.component.html',
})
export class CreateBlogCategoryComponent implements OnInit {
  error = '';
  submitted = false;
  constructor(private blogCategoriesService: BlogCategoriesService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
  ) {}
  blogCategories = this.fb.group(
    {
      name: ['', Validators.compose([Validators.required])],
      slug: ['', Validators.compose([Validators.required])],
      status: ['1']});
  ngOnInit(): void {}
  get f() {
    return this.blogCategories.controls;
  }
  // Create slug
  modelChangeFn(e){
    const text = this.transform(e);
    this.blogCategories.patchValue({slug: text});
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

  saveBlogCategories(): any {
    this.submitted = true;
    // return validators
    if (this.blogCategories.invalid) {
      return false;
    }
    this.blogCategoriesService.create(this.blogCategories.value).subscribe(
      (response) => {
        this.newBlogCategory();
        this.toastrService.success('Thêm mới thành công!');
      },
      (error) => {
        console.log(error);
      });
  }
  newBlogCategory(): void {
    this.submitted = false;
    this.blogCategories = this.fb.group(
      {
        name: [''],
        slug: [''],
        status: ['1']});
  }
}
