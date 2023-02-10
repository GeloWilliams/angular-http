# Setting Headers (headers)

Headers can be configured in an optional object param, for example,
the second param in GET and third param in POST methods. Within this
configuration object, the headers key should be of type HttpHeaders
object. This nested object contains the header properties to be
set for the specific API you plan to connect with.

# Appending Query Params (params)

When calling the immutable HttpParams object, you can append multiple
params by creating a variable and reassigning it as many times as
needed:

let searchParams = new HttpParams();<br />
searchParams.append('someKey', 'someValue');<br />
searchParams.append('print', 'pretty');<br />
...

# Observe Property (observe)

By default, the response will send the body. However if you want the full
response data, you must set the 'observe' property to 'response' in the
optional object param of the http verb method. The full response will not
only include the body, but also the headers, status, statusText, etc.<br />

The 'events' value gives us access to all events occurring within a
transaction. For example, you may want to update the UI when a sent
http event type has happened then logging some information when a response
http event type has occurred. In any case, the HttpEventType object must
be imported.

# Why Use tap operator?

Although pipes transform the data output format, tap allows us to do something
with the data without altering it in anyway. It is also great for debugging 
or logging.

# subscribe Method using Multiple Params has been deprecated since Angular 8

While in the past, you could write a subscribe method, adding multiple optional
params such as:

*this.fetchPosts().subscribe(<br />
    &emsp;posts => {<br />
        &emsp;&emsp;console.log("posts changed", posts);<br />
        &emsp;&emsp;this.postsChanged$.next(posts);<br />
    &emsp;},<br />
    &emsp;err => { this.error$.next(err.message); }<br />
);*

There is now an object param that includes the 'next', 'error', and 'complete'
keys:

*this.fetchPosts().subscribe({<br />
    &emsp;next: posts => {<br />
        &emsp;&emsp;console.log("posts changed", posts);<br />
        &emsp;&emsp;this.postsChanged$.next(posts);<br />
    &emsp;},<br />
    &emsp;error: err => {<br />
        &emsp;&emsp;this.error$.next(err.message);<br />
    &emsp;},<br />
    &emsp;complete: () => {<br />
        &emsp;&emsp;console.log('posts successfully grabbed');<br />
    &emsp;}
});*
