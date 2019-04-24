import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../../shared/models/user.model';
import {LoginService} from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  user: UserModel = new UserModel();

  constructor(
    private formBuilder: FormBuilder,
    // tslint:disable-next-line:variable-name
    private _loginService: LoginService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.loginForm.get('username').setValue(this.user.username);
    this._loginService.setUser(this.user);
  }
}
