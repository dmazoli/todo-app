import {Component, inject, OnInit} from '@angular/core';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {TaskComponent} from "../task/task.component";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {TasksService} from "../../services/tasks-service/tasks.service";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  standalone: true,
  imports: [CdkDrag, CdkDropList, TaskComponent, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, AsyncPipe, MatProgressSpinner]
})
export class TodoComponent implements OnInit{
  public tasksService = inject(TasksService);


  ngOnInit() {
    this.tasksService.listTasks().subscribe()
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }
}
