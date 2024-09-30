import { Component, inject, OnInit } from '@angular/core';
import { PassDataService } from '../../services/pass-data.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  passUser = inject(PassDataService);
  imgUrl = './../../../assets/img/banner.png';
  ngOnInit() {
    const getUser = this.passUser.getUser.source._value;
    console.log('Profile User:', getUser);
  }
}
