import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/components/common/dialog/alert-dialog/alert-dialog.component';
import { SubscriptionService } from 'src/app/services/http-services/subscription.service';

@Component({
  selector: 'app-update-card-details',
  templateUrl: './update-card-details.component.html',
  styleUrls: ['./update-card-details.component.css']
})
export class UpdateCardDetailsComponent implements OnInit {

  updateCardForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(16)]),
    expiryMonth: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(2)]),
    expiryYear: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(4),  Validators.maxLength(4)]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private route: Router, 
  private dialog: MatDialog, public dialogRef: MatDialogRef<any>, private subscriptionServices: SubscriptionService) { }

  ngOnInit(): void {
    this.updateCardForm.setValue({
      cardNumber: this.data.CardNumber,
      expiryMonth: this.data.ExpiryMonth,
      expiryYear: this.data.ExpiryYear
    });
  }

  onSubmit() {
    let form = this.updateCardForm;
    let CardDetails = {
      CardNumber: form.value["cardNumber"],
      ExpiryMonth: form.value["expiryMonth"],
      ExpiryYear: form.value["expiryYear"],
      CustomerId: this.data.CustomerId
    };

    this.subscriptionServices.updateCustomerCardDetails(CardDetails).subscribe(res => {
      debugger;
      if(res && res.Data > 0) {
        this.openAlertDialog("Card details updated successfully.");
        this.dialogRef.close(true);
      }
      else {
        this.openAlertDialog("error occurred. Please contact support team.");
      }
    });
  }

  openAlertDialog(alertMessage: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: alertMessage,
        buttonText: {
          cancel: "OK",
        },
      },
    });
  }



  closeDialog() {
    this.dialogRef.close(false);
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.updateCardForm.controls[controlName].hasError(errorName);
  }

}
