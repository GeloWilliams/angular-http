import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})

export class PostsService {
   /* Inject HttpClient upon instantiation of PostService object */
   constructor(private http: HttpClient) {}

   /* Data Member: postsChanged$ Subject */
   public postsChanged$ = new Subject<Post[]>();

   /* Data Member: error$ Subject
      -- forwards error message to all subscribers */
   public error$ = new Subject<string>();

   /* Operation: createAndStorePost
      -- sends POST http request
      -- subscribes for the response */
   public createAndStorePost(title: string, content: string): void {
      /* Send Http request
         -- Angular takes our Javascript object and converts it to JSON
            data for the API's digestion
         -- Angular will not allow a request to be made without an observable,
            you must subscribe to the request. Angular and rxjs know that we
            need a subscription in order to get access to the response
         -- expect to receive {name: string} object from response */
      this.http.post<{ name: string }>(
         'https://some-database/posts.json',
         { title, content },
         {
            headers: new HttpHeaders({
               'Custom-Header': 'Hello'
            }),
            params: new HttpParams().set('print', 'pretty')
         }
      ).subscribe(
         { next: responseData => {
            // We can view the response in the console
            console.log(responseData);
            /* subscribe and retrieve changes for fetchPosts
   
               Note: must be included in this subscribe scope in order
               to retrieve the latest changes
            */
            this.fetchPosts().subscribe({
               next: posts => {
                  // const postsArray = [...posts, {title, content, id: responseData.name}]
                  console.log("posts changed", posts)
                  this.postsChanged$.next(posts);
               }}); 
            },
            error: err => { this.error$.next(err.message); }
         }
      );
   } // end createAndStorePost

   /* Operation: fetchPosts
      -- uses a GET method to retrieve all posts, logging them in
         the console 
      -- pipe allows us to funnel and transform data
      -- response body is an observable that must be subscribed to in another component */
   public fetchPosts(): Observable<Post[]> {
      // we can explicitly cast the type of data we want to retrieve <{x: y}>
      return this.http.get<{ [key: string]: Post }>('https://some-database/posts.json').pipe(
         /* 
               // catchError operator:
               // -- good for doing side effects in terms of error handling 
               // -- needs to return an Observable to align with fetchPosts()
               // -- throwError is an Observable we can use 
               catchError(error => {
                  // simple side effect:
                  console.log("Got an error: ", error.message);
                  // throwError is an Observable the requires a callback to pass the error as a new Error
                  // at the time of throwing in order to create a more accurate stack trace 
                  return throwError(() => { 
                     new Error(error)
                  });
               }),     
         */

         // map rewraps data into an observable of new data 
         /* [x: y] syntax is a "placeholder property" for objects, you can list an arbitrary
            number of properties with this syntax */
         map((responseData: { [key: string]: Post }) => {
            const postsArray: Post[] = [];
            // loop through keys and push their values ({content: '', title: ''}) to postsArray
            for (const key in responseData) {
               // use if (x.hasOwnProperty(y)) when using for-in loops for safety
               if (responseData.hasOwnProperty(key)) {
                  /* ...operator extracts all original object data, allowing us to append a new key
                  to the transformed object - 'id' */
                  postsArray.push({ ...responseData[key], id: key})
               }
            }
            return postsArray; // to forward the transformed data to our next operator/subscribe method
         }),
      );
   } // end fetchPosts

   /* Operation: deleteAllPosts
      -- uses a DELETE method to delete all posts
      -- pipe allows us to funnel and transform data
      -- response body is an observable that must be subscribed to in another component */
   public deleteAllPosts(): Observable<any> {
      // using one param - the URL with all posts will delete all posts!
      return this.http.delete(
         'https://some-database/posts.json',
         {
            observe: 'events'
         }
      ).pipe(
         tap((events: any) => {
            if (events.type === HttpEventType.Sent) {
               console.log('~Delete request sent~');
            } else if (events.type === HttpEventType.Response) {
               console.log('~Gathering the response now~')
            }
         })
      );
   }
} 