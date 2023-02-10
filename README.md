# subscribe Method using Multiple Params has been deprecated since Angular 8

While in the past, you could write a subscribe method, adding multiple optional
params such as:

*this.fetchPosts().subscribe(
    posts => {
        console.log("posts changed", posts)
        this.postsChanged$.next(posts);
    },
    err => { this.error$.next(err.message); }
);*

There is now an object param that includes the 'next', 'error', and 'complete'
keys:

*this.fetchPosts().subscribe({
    next: posts => {
        console.log("posts changed", posts)
        this.postsChanged$.next(posts);
    },
    error: err => { 
        this.error$.next(err.message); 
    },
    complete: () => {
        console.log('posts successfully grabbed');
    }
});*