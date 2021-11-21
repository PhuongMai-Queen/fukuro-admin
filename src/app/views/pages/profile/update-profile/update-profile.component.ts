import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { AdminsService } from '../../../../services/admins.service';

@Component({
  selector: 'ngx-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  images = null;
  admins: FormGroup;
  id: null;
  submitted = false;
  constructor(public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private adminsService: AdminsService)
  {
    this.admins = this.fb.group({
      avatar: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    const id = localStorage.getItem('id');
    if (id) {
      this.adminsService.get(id)
        .subscribe(
          data => {
            this.admins = this.fb.group({
              avatar: [data.avatar],
              username: [data.username],
              password: [data.password],
              email: [data.email],
              firstName: [data.firstName],
              lastName: [data.lastName],
              phone: [data.phone],
              role: [data.role],
              status: [data.status],
            });
          });
    }
  }
  get f() {
    return this.admins.controls;
  }

  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.admins.patchValue({
      thumbnail: file,
    });
    this.admins.get('thumbnail').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.admins.patchValue({
        thumbnail: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  saveAdmin(): void {
    // const data = {
    //   name: this.blogCategories.name,
    //   status: this.blogCategories.status,
    // };
    // // console.log(data);
    // this.blogCategoriesService.update(this.id, data).subscribe(
    //   (response) => {
    //     this.toastrService.success(response.message);
    //   },
    //   (error) => {
    //     this.toastrService.error(error);
    //   });
  }
}
