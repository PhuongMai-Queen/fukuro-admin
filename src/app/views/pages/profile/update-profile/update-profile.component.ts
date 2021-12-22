import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { AdminsService } from '../../../../services/admins.service';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'ngx-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  id = '';
  result = false;
  images = null;
  submitted = false;
  admins: FormGroup;
  error = '';
  constructor(public fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private adminsService: AdminsService,
              private http: HttpClient)
  {
    this.admins = this.fb.group({
      avatar: [''],
      username: ['', Validators.compose([Validators.required])],
      password: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: [''],
      lastName: [''],
      phone: ['', Validators.compose([Validators.pattern('[0-9 ]{10}')])],
      role: ['1', Validators.compose([Validators.required])],
      status: ['1'],
      avatarCus: [''],
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    const id = localStorage.getItem('id');
    if (id) {
     this.getData(id);
    }
  }
  get f() {
    return this.admins.controls;
  }

  getData(id: any){
    this.adminsService.get(id)
      .subscribe(
        data => {
          this.admins = this.fb.group({
            avatar: [environment.linkImg+data.avatar],
            username: [data.username],
            password: [data.password],
            email: [data.email],
            firstName: [data.firstName],
            lastName: [data.lastName],
            phone: [data.phone],
            role: [data.role],
            status: [data.status],
            avatarCus: [data.avatar],
          });
        });
  }
  // Image Preview
  showPreview(event) {
    if (event.target.files.length > 0) {
      const file2 = event.target.files[0];
      this.images = file2;
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.admins.patchValue({
      avatar: file,
    });
    this.admins.get('avatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.admins.patchValue({
        avatar: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }
  //  Update profile
  updateAdmin(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    if(this.images == null){
      const data = {
        avatar: this.admins.value['avatarCus'],
        username: this.admins.value['username'],
        password: this.admins.value['password'],
        email: this.admins.value['email'],
        first_name: this.admins.value['firstName'],
        last_name: this.admins.value['lastName'],
        phone: this.admins.value['phone'],
        role: this.admins.value['role'],
        status: this.admins.value['status'],
      };
      this.adminsService.update(this.id, data).subscribe(
        (response) => {
          this.submitted = true;
          const name = this.admins.value['firstName']+' '+this.admins.value['lastName'];
          this.adminsService.profileImageUpdate$.next(this.admins.value['avatar']);
          this.adminsService.profileName$.next(name);
          this.toastrService.success(response.message);
        },
        (error) => {
          this.toastrService.success(error.message);
        });
    }else{
      this.adminsService.get(this.id).toPromise().then(
          data => {
            const options = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
              }),
              body: {
                file_name: data.avatar,
              },
            };
            this.http.delete(environment.apiDeleteImg, options).subscribe();
          });
      this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            avatar: res['filename'],
            username: this.admins.value['username'],
            password: this.admins.value['password'],
            email: this.admins.value['email'],
            first_name: this.admins.value['firstName'],
            last_name: this.admins.value['lastName'],
            phone: this.admins.value['phone'],
            role: this.admins.value['role'],
            status: this.admins.value['status'],
          };
          this.adminsService.update(this.id, data).subscribe(
            (response) => {
              this.submitted = true;
              const name = this.admins.value['firstName']+' '+this.admins.value['lastName'];
              this.adminsService.profileImageUpdate$.next(environment.linkImg+res['filename']);
              this.adminsService.profileName$.next(name);
              this.toastrService.success(response.message);
            },
            (error) => {
              this.toastrService.success(error.message);
            });
        }
      });
    }
  }
}
