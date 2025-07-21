import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from '../../models/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined;

  private _profile: UserProfile | undefined;

  get keycloak(){
    if (!this._keycloak){
      this._keycloak=new Keycloak({
        url:'http://localhost:9090',
        realm: 'gestion-rh',
        clientId: 'grh'
      });
    }
    return this._keycloak;
  }

  get profile():UserProfile|undefined{
    return this._profile;
  }

  constructor() { }

  async init(): Promise<void>{
    console.log("Authentication the user...")
    const authenticated:boolean = await this.keycloak?.init({
      onLoad: 'login-required',
    });
    if (authenticated){
      console.log("User Authenticated");
      this._profile = (await this.keycloak?.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak?.token;
      console.log("User Profile: ",this._profile);
      console.log("User Token: ",this._profile.token);

    };
  }

  login():Promise<void>{
    return this.keycloak?.login();
  }

  logout():Promise<void>{
    return this.keycloak?.logout({redirectUri:'http:localhost:4200'});
  }
}
