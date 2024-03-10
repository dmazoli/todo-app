import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {TaskInterface} from "../../interfaces/task.interface";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private baseUrl = environment.url
  private tasksApiPath = 'tasks'

  public tasks$: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<TaskInterface[]>([]);
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    (!!environment.port)
      ? this.baseUrl = `${environment.url}:${environment.port}`
      : null;
  }

  createTask(data: TaskInterface): Observable<TaskInterface> {
    this.loading$.next(true);
    return this.http
      .post<TaskInterface>(
        `${this.baseUrl}/${this.tasksApiPath}`,
        data,
        {observe: 'body'})
      .pipe(
        tap((task) => {
          this.loading$.next(false);
        })
      );
  }

  retrieveTask(id: string | number): Observable<TaskInterface> {
    this.loading$.next(true);
    return this.http
      .get<TaskInterface>(
        `${this.baseUrl}/${this.tasksApiPath}/${id}`,
        {observe: 'body'})
      .pipe(
        map(
          (rawTask) => {
            (!rawTask.description) ? rawTask.description = 'low' : null;
            return rawTask;
          })
        ),
        tap((task) => {
          this.loading$.next(false);
        })
      );
  }
  updateTask(data: TaskInterface): Observable<TaskInterface> {
    this.loading$.next(true);
    return this.http
      .post<TaskInterface>(
        `${this.baseUrl}/${this.tasksApiPath}/${data.id}`,
        data,
        {observe: 'body'})
      .pipe(
        tap((task) => {
          this.loading$.next(false);
        })
      );
  }

  deleteTask(id: string | number): Observable<boolean> {
    this.loading$.next(true);
    return this.http
      .delete<boolean>(
        `${this.baseUrl}/${this.tasksApiPath}/${id}`,
        {observe: 'response'})
      .pipe(
        map(
          (deleteResponse) => {
            return deleteResponse.status == HttpStatusCode.NoContent;
          }
        ),
        tap((task) => {
          this.loading$.next(false);
        })
      );
  }

  listTasks(): Observable<TaskInterface[]> {
    this.loading$.next(true);
    return this.http
      .get<TaskInterface[]>(
        `${this.baseUrl}/${this.tasksApiPath}`,
        {observe: 'body'})
      .pipe(
        map(
          (rawList) => rawList.map((item) => {
            (!item.description) ? item.description = 'low' : null;
            return item;
          })
        ),
        tap((tasksList) => {
          this.tasks$.next(tasksList);
          this.loading$.next(false);
        })
      );
  }




}
