import { Component, OnInit } from '@angular/core';
import {Admins} from '../../../../models/admins.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminsService} from '../../../../services/admins.service';
import {ToastrService} from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MustMatch} from '../../../../services/validators/must-match.validator';
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
      avatar: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
      role: ['1', Validators.compose([Validators.required])],
      status: ['1'],
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
            avatar: [data.avatar, Validators.compose([Validators.required, Validators.minLength(6)])],
            username: [data.username, Validators.compose([Validators.required])],
            email: [data.email, Validators.compose([Validators.required, Validators.email])],
            firstName: [data.firstName, Validators.compose([Validators.required])],
            lastName: [data.lastName, Validators.compose([Validators.required])],
            phone: [data.phone, Validators.compose([Validators.required, Validators.pattern('[0-9 ]{10}')])],
            role: [data.role, Validators.compose([Validators.required])],
            status: [data.status],
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
      this.adminsService.update(this.id, this.admins.value).subscribe(
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
          this.toastrService.success(error.message);
        });
    }else{
      this.http.post(environment.apiPostImg, formData).toPromise().then(res => {
        this.result = true;
        if(this.result == true){
          const data = {
            avatar: environment.linkImg+res['filename'],
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
              this.toastrService.success(error.message);
            });
        }
      });
    }
  }
}
