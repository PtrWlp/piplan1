import {Component, OnInit, ViewChild} from '@angular/core';
import {ProgramIncrement} from '../../shared/service/piplan.models';
import {ProgramIncrementService} from '../../shared/service/programincrement.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { Router} from '@angular/router';
import {AppConfig} from '../../configs/app.config';
import {UtilsHelperService} from '../../core/services/utils-helper.service';
import {ProgramIncrementRemoveComponent} from './programincrement-remove/programincrement-remove.component';

@Component({
  selector: 'piplan-programincrements',
  templateUrl: './programincrements.component.html',
  styleUrls: ['./programincrements.component.scss'],
  animations: [UtilsHelperService.fadeInOut()]
})

export class ProgramIncrementsComponent implements OnInit {

  programincrements: ProgramIncrement[];
  newProgramIncrementForm: FormGroup;
  error: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private programincrementService: ProgramIncrementService,
              private dialog: MatDialog,
              private router: Router,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {

    this.newProgramIncrementForm = this.formBuilder.group({
      'name': new FormControl('', [Validators.required]),
      'start': new FormControl('', [Validators.required])
    });

  }

  ngOnInit() {
    this.programincrementService.getProgramIncrements().subscribe((programincrements: Array<ProgramIncrement>) => {
      this.programincrements = programincrements;
    });
  }

  createNewProgramIncrement(newProgramIncrement: any) {
    if (this.newProgramIncrementForm.valid) {
      this.programincrementService.createProgramIncrement(new ProgramIncrement(newProgramIncrement)).then(() => {
        this.myNgForm.resetForm();
      }, () => {
        this.error = 'errorHasOcurred';
      });
    }
  }

  deleteProgramIncrement(programincrement: ProgramIncrement) {
    const dialogRef = this.dialog.open(ProgramIncrementRemoveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.programincrementService.deleteProgramIncrement(programincrement.id).then(() => {
          this.showSnackBar(`programincrement ${programincrement.name} removed`);
        }, () => {
          this.error = 'programincrementDefault';
        });
      }
    });
  }

  seeProgramIncrementDetails(programincrement): void {
    if (programincrement.default) {
      this.router.navigate([AppConfig.routes.programincrements + '/' + programincrement.id]);
    }
  }

  showSnackBar(message) {
    const config: any = new MatSnackBarConfig();
    config.duration = 3000;
    this.snackBar.open(message, 'OK', config);
  }

}
