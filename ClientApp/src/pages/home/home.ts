import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ng-socket-io';
import { SERVER_URL } from "../../resource";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  errorMessage: string = "";
  ro:boolean = false;
  data = {
    url: "",
    isRedirect: false
  }

  constructor(private navCtrl: NavController, private httpClient: HttpClient, private socket: Socket) { }

  submit() {
    if(this.data == null) {
      this.errorMessage = "Internal Error";
      return;
    }

    this.httpClient.post<UserResponse>(SERVER_URL, this.data).subscribe(
        data => {
          this.errorMessage = data.error;
          this.data.url = data.url;
//No server error
          if(this.errorMessage == "") {
//Redirect to the URL the user inserted
            if(this.data.isRedirect == false)
              window.open(this.data.url, "_self")
//Asked to be redirected, start working with the socket.
            else
            {
              this.ro = true;
              this.socket.connect();
              this.socket.on('message', (data) => {
                this.data.url = data;
              });
            }
          }
        }
      );
    }

  disconnect() {
    this.socket.disconnect();
    this.ro = false;
  }
}

interface UserResponse {
  url: string;
  error: string;
}
