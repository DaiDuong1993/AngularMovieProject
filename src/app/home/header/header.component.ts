import { Component, OnInit } from '@angular/core';
import Sweet from 'sweetalert2';
import {Router} from '@angular/router';
import { NguoiDungService } from 'src/app/core/services/nguoi-dung.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dangNhapStatus: boolean = false;
  constructor(private router: Router,private qlyNguoiDung: NguoiDungService) { 

  }

  ngOnInit() {
    
    this.CheckLogIn();
    this.qlyNguoiDung.dangNhapStatus.subscribe((dangNhapStatus)=>{
      this.dangNhapStatus = dangNhapStatus;
    })
  }
  CheckLogIn(){
    if(localStorage.getItem('userLogin'))
    {
      this.dangNhapStatus= true; 
    }else{
      this.dangNhapStatus = false;
    }
    
  }
  logOutCheck(){
    Sweet.fire({
      title: 'Bạn Muốn Đăng Xuất Ngay Sao?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Liền Ngay và Lập Tức!'
    }).then((result) => {
      if (result.value) {
        Sweet.fire(
          'Bạn đã đăng xuất!'
        )
        this.dangNhapStatus = false;
        localStorage.removeItem('userLogin');
        localStorage.removeItem('accessToken');
        this.reDirect();
      }
    })
  }
  reDirect(){
    this.router.navigate(['/']);
    
  }
}
