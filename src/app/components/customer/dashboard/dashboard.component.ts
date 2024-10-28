import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubscriptionService } from 'src/app/services/http-services/subscription.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../common/dialog/alert-dialog/alert-dialog.component';
import { UpdateCardDetailsComponent } from './update-card-details/update-card-details.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isChecked: boolean = false;
  subscriptionList?: any[];
  email: string = "";
  constructor(private matDialog: MatDialog, private subscriptionServices: SubscriptionService, private router: Router) { }

  ngOnInit(): void {
    let customerEmail = this.sessionGet("_currentEmail");
    if(customerEmail != null) {
      this.email = customerEmail;
      this.getProductSubscription();
    }
    else {

      const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Ops!! Your session has been expired. Please login again.',
          buttonText: {
            ok: 'OK',
            cancel: ''
          }
        },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        debugger;
        if (confirmed) {
          window.location.href = this.router['location']._platformLocation.location.origin
        }
      });
      
    }
    
  }

  sessionGet(key: any) {
    let stringValue = window.sessionStorage.getItem(key)
      if (stringValue !== null) {
        let value = JSON.parse(stringValue)
          let expirationDate = new Date(value.expirationDate)
          if (expirationDate > new Date()) {
            return value.value
          } else {
            window.sessionStorage.removeItem(key)
          }
      }
      return null
  }

  getProductSubscription() {


    const dialogRefPaymentInProgress = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: "loading data...",
        spinnerOn: true,
        confirmButtonText: '',
        buttonText: {
          ok: '',
          cancel: ''
        }
      }
    });

    this.subscriptionServices.getSubscriptionDetailsByEmail(this.email).subscribe(res => {
      debugger;
      dialogRefPaymentInProgress.close();
      if (res && res.Data) {
        this.subscriptionList = res.Data;
      }
      else {
        alert("error");
      }
    });
  }

  isRecordPresents() {
    if (this.subscriptionList !== undefined && this.subscriptionList?.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }



  subscribtionSlideChange(event: any, scheduleId: number) {
    console.log(event);
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you want to change the subscription status?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      debugger;
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.StatusUpdate(event.checked, scheduleId);
      }
      else {
        this.toggleSlidByCheckedValue(event.checked, scheduleId);
      }
    });
  }

  StatusUpdate(flag: boolean, scheduleId: number) {
    this.subscriptionServices.activeOrInActiveSubscription(flag, scheduleId).subscribe(s => {
      if (s.Data && s.Data > 0) {
        this.openAlertDialog("Subscription operation updated successfully.");
      }
      else {
        this.openAlertDialog("error occurred. please contact support team.");
        this.toggleSlidByCheckedValue(!flag, scheduleId);
      }
    });
  }

  toggleSlidByCheckedValue(checked: boolean, scheduleId: number) {
    debugger;

    this.subscriptionList?.map(m => {
      if (m.ScheduleId == scheduleId) {
        m.IsActive = !checked;
      }
    });


  }

  updateCardDetails(item: any) {
    const dialogRef = this.matDialog.open(UpdateCardDetailsComponent, {
      data: item,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.getProductSubscription();
      }
    });
  }

  deleteSubscription(scheduleId: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete the subscription?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.subscriptionServices.deleteProductSubscription(scheduleId).subscribe(res => {
          if(res && res.Data > 0) {
            this.openAlertDialog("Delete operation successfully.");
            this.getProductSubscription();
          }
          else {
            this.openAlertDialog("Error ocurred. please contact support team.");
          }
        });
      }
    });
  }

  openAlertDialog(alertMessage: string) {
    const dialogRef = this.matDialog.open(AlertDialogComponent, {
      data: {
        message: alertMessage,
        buttonText: {
          cancel: "OK",
        },
      },
    });
  }

}
