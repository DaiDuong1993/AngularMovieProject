import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { QuanLyPhimService } from 'src/app/core/services/quan-ly-phim.service';

@Component({
  selector: 'app-chi-tiet-phim',
  templateUrl: './chi-tiet-phim.component.html',
  styleUrls: ['./chi-tiet-phim.component.scss']
})
export class ChiTietPhimComponent implements OnInit {
  subMovieDetail: Subscription;
  subParams: Subscription;
  maPhim:number;
  linkTrailer:string;
  hienthi:boolean = false;
  chiTietPhim: any={}
  constructor(private quanLyDanhSachPhim : QuanLyPhimService,private activateRoute : ActivatedRoute ) { }

  ngOnInit() {
    this.subParams = this.activateRoute.params.subscribe((params)=>{
      this.maPhim = params.id;
      this.getMovieDetail(this.maPhim);
    })
    
    
  }
  hideVideo(){
    this.hienthi=false;
   
  }
  phatTrailer(){
    
    this.hienthi = true;
    let link = this.chiTietPhim.trailer+"?autoplay=1";
    this.linkTrailer = link;
    
  }


  getMovieDetail(maPhim:number){
    this.subMovieDetail = this.quanLyDanhSachPhim.layChiTietPhim(maPhim).subscribe((data)=>{
      // console.log(data);
      this.chiTietPhim = data;
      
    })
  }
}
