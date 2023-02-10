import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  /* Data Member: loadedPosts */
  public loadedPosts: Post[] = [];

  /* Data Member: isFetching
     -- determines whether to display loading spinner */
  public isFetching: boolean = false;

  /* Data Member: error 
     -- initially falsy, as it is set to null
     -- becomes truthy if we set it to something
     -- whether the error comes from reading or 
        writing, this property is used */
  public error: any = null;

  /* Data Member: errSub
     -- subscription to the error Subject in postsService
     -- used as an example subject pattern when creating posts
        in this app */
  private errSub: Subscription = new Subscription;

  /* Inject the HttpClient module upon instantiation of this AppComponent */
  constructor(private postsService: PostsService) {}

  ngOnInit() {
    /* subscription in case of errors
       -- postsServices has configured this subject pattern to work only with 
          the creation of posts, not the fetching of them */
    this.errSub = this.postsService.error$.subscribe(errMsg => { this.error = errMsg; });

    this.fetchPosts();
    // fetch posts to update the list
    /* -- subscribe method has an object that contains 
      next, error, and complete keys
    -- the error object we receive always has a message on it */
    this.postsService.postsChanged$.subscribe(
      posts => { this.loadedPosts = posts }
    );
  }

  /* Operation: onCreatePost
     -- calls createAndStorePost in postsService */
  public onCreatePost(postData: Post) {
    // wait for the new post to be posted before fetching all posts
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  public onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  public onClearPosts() {
    // Send Http request
    this.postsService.deleteAllPosts().subscribe( () => {
      // any response info is not needed, just reset loadedPosts
      this.loadedPosts = [];
    })
  }

  public fetchPosts(): void {
    // notify isFetching
    this.isFetching = true;
    /* -- subscribe method has an object that contains 
          next, error, and complete keys
       -- the error object we receive always has a message on it */
    this.postsService.fetchPosts().subscribe({
      next: posts => {
        // posts have been retrieved, notify isFetching
        this.isFetching = false;
        this.loadedPosts = posts;
        // this.postsChanged$.next(posts);
      }, 
      error: err => {
        this.error = err.message;
      }
    });
  } // end fetchPosts

  ngOnDestroy(): void {
    this.errSub.unsubscribe();
  }
}