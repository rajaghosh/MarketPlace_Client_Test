import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  isOtherButtonDisplay: boolean = false;
  otherButtonText = ""
  isUpperButtonShow: boolean = false;
  spinnerOn: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || '';

        this.isUpperButtonShow = true;

        this.otherButtonText = data.buttonText.Other || "";
        if (this.otherButtonText != "")
          this.isOtherButtonDisplay = true;
      }
      if (data.spinnerOn !== undefined && data.spinnerOn) {
        this.spinnerOn = true;
      }
    }
  }

  isDisplayCancelButton() {
    if (this.cancelButtonText != "") {
      return true;
    }
    else {
      return false;
    }
  }

  isDisplayOKButton() {
    if (this.data.confirmButtonText != "") {
      return true;
    }
    else {
      return false;
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onOtherClick(): void {
    this.dialogRef.close("OtherButtonClose");
  }

}
