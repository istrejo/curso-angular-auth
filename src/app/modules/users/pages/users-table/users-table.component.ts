import { UsersService } from './../../../../services/users.service';
import { Component, OnInit } from '@angular/core';

import { DataSourceUser } from './data-source';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent implements OnInit {
  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];
  user$: Observable<User | null>;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users: any) => {
      this.dataSource.init(users);
    });
  }
}
