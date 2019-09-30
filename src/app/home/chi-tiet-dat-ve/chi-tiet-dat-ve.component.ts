import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {QuanLyPhimService} from '../../core/services/quan-ly-phim.service';
import {Subscription} from 'rxjs';
import Sweet from 'sweetalert2';
import {config} from '../../core/Commons/Config';
import { ThongTinDatVe } from '../../core/Models/thong-tin-dat-ve';
import { SweetAlertService } from '../../core/services/SweetAlertService';
@Component({
  selector: 'app-chi-tiet-dat-ve',
  templateUrl: './chi-tiet-dat-ve.component.html',
  styleUrls: ['./chi-tiet-dat-ve.component.scss']
})
export class ChiTietDatVeComponent implements OnInit, OnDestroy {

  constructor(private atvRoute: ActivatedRoute, private qlyPhimService: QuanLyPhimService ) { }
  subPram: Subscription;
  subService: Subscription;
  lichChieu: any = {};
  danhSachGheDangDat: any[] = [];
  tongTien:number = 0;
  ngOnDestroy() {
    this.subPram.unsubscribe();
    this.subService.unsubscribe();
  }
  ngOnInit() {
    this.subPram = this.atvRoute.params.subscribe((params)=>{
      // console.log(params);

      this.layThongTInLichChieu(params.maLichChieu);
    })

    this.qlyPhimService.datGhe.subscribe((gheDangDat) => {
      //Xử lý đặt ghế tại hàm subscribe từ output của service
      if (gheDangDat.dangDat) //dangDat = true
      {
        this.danhSachGheDangDat.push(gheDangDat);
      } else {
        let index = this.danhSachGheDangDat.findIndex(ghe => ghe.maGhe === gheDangDat.maGhe);
        if (index !== -1) {
          this.danhSachGheDangDat.splice(index, 1);
        }
      }
      console.log('mảng ghế đang đặt', this.danhSachGheDangDat);
      this.tinhTongTien();
    })
  }


  layThongTInLichChieu(maLichChieu:number){
    this.subService = this.qlyPhimService.layThongTinLichChieuPhim(maLichChieu).subscribe((data)=>{
      console.log(data);
      this.lichChieu = data;
    })
  }

  tinhTongTien(){
    let tongTien = 0;
    this.danhSachGheDangDat.forEach((ghe,index) =>{
      tongTien+=ghe.giaVe;
    });
    this.tongTien = tongTien;
  }
  datVe(){
    if(this.danhSachGheDangDat.length == 0){
      Sweet.fire('Thong Bao','Ban Chua Dat Ghe!','warning');
      return;
    }
    // Lấy dữ liệu user từ localStoreage
    const userLogin = JSON.parse(localStorage.getItem(config.userLogin));
    // Gọi API đưa dữ liệu lên serve
    let ttDatVe = new ThongTinDatVe(this.lichChieu.maLichChieu,userLogin.taiKhoan);
    ttDatVe.danhSachVe = this.danhSachGheDangDat;
    SweetAlertService.showMessageConfirm(()=>{
      this.qlyPhimService.datVe(ttDatVe).subscribe(result=>{
        console.log(result);
      }),error=>{
        console.log(error)
      }
    }).then(()=>{
      this.layThongTInLichChieu(this.lichChieu.maLichChieu);
    })
    
  }

}
