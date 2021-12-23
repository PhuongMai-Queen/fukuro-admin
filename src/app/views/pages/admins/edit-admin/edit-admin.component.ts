import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import './edit-admin.loader';
import 'ckeditor';



@Component({
  selector: 'ngx-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss'],
})
export class EditAdminComponent implements OnInit {
  id = '';
  idAdmin = '';
  result = false;
  images = null;
  submitted = false;
  error = '';
  admins = this.fb.group({
      avatar: [''],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: [''],
      lastName: [''],
      phone: [''],
      role: [''],
      status: ['1'],
      avatarCus: [''],
    });
  constructor(private adminsService: AdminsService,
              public fb: FormBuilder,
              private toastrService: ToastrService,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.idAdmin = localStorage.getItem('id');
    this.getData(this.id);
  }

  get f() {
    return this.admins.controls;
  }

  getData(id): void {
    this.adminsService.get(id)
      .subscribe(
        data => {
          this.admins = this.fb.group({
            avatar: [environment.linkImg+data.avatar],
            username: [data.username, Validators.compose([Validators.required])],
            email: [data.email, Validators.compose([Validators.required, Validators.email])],
            firstName: [data.firstName],
            lastName: [data.lastName],
            phone: [data.phone],
            role: [data.role],
            status: [data.status],
            avatarCus: [data.avatar],
          });
        },
        error => {
          console.log(error);
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
  //  Update admin
  updateAdmin(): any {
    const formData = new FormData();
    formData.append('file', this.images);
    this.submitted = true;

    // return validators
    if (this.admins.invalid) {
      return false;
    }
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
          if(this.id == this.idAdmin){
            const name = this.admins.value['firstName']+' '+this.admins.value['lastName'];
            this.adminsService.profileImageUpdate$.next(this.admins.value['avatar']);
            this.adminsService.profileName$.next(name);
          }
          this.toastrService.success(response.message);
        },
        (error) => {
          this.toastrService.error(error.message);
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
              if(this.id == this.idAdmin){
                const name = this.admins.value['firstName']+' '+this.admins.value['lastName'];
                this.adminsService.profileImageUpdate$.next(this.admins.value['avatar']);
                this.adminsService.profileName$.next(name);
              }
              this.toastrService.success(response.message);
            },
            (error) => {
              this.toastrService.error(error.message);
            });
        }
      });
    }
  }
}
