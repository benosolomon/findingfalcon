import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy{
  finalResponse: any = {};
  constructor(private appService: AppService, private router: Router) {}

  // To get all element of the dialog component after component get initialized.
  ngOnInit(): void {
    this.finalResponse = this.appService.getResult();
  }

  resetGame() {
    // this.appService.resetEverything();
    this.router.navigate(['../home']);
  }
  ngOnDestroy(): void {
    this.appService.resetEverything();
  }
}
