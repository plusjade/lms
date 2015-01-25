### How to Run Locally

The app is a standard Rails 4.x app.

#### Install Gems

    $ bundle

#### Add API Keys

Dropbox and AWS S3 integration are not required locally. However you need to make sure you create the file `config/sesames.json` which holds the API keys:

```json
{
    "dropbox" : {
        "key" : "KEY",
        "secret" : "SECRET"
    },
    "sentry-raven" : {
        "dsn" : "ENDPOINT"
    },
    "s3" : {
        "access_key_id" : "KEY",
        "secret_access_key" : "SECRET"
    }
}

```

Bad values should work as long as you aren't actually calling/using the service. More on that shortly.


#### Create a teacher

    $ rails c
    > t = Teacher.new(uid: 1, name: "Your Name", email: "email@test.com")
    > t.valid?
    > t.save


Note `uid:1` is the uid from the Dropbox oAuth2 handshake. Setting it manually _might_ cause problems, but let's get the app running first.
Also, there is no password because makeist uses third-party authentication. We can get around that shortly.


#### Add Sample Data

Create a sample course with lessons and 12 students:

    $ rails c
    > require 'forgery' ; require 'factory_girl' ; FactoryGirl.reload
    > c = FactoryGirl.create(:course, :with_lessons, name: "Sample")
    > FactoryGirl.create_list(:student, 12, :full_sample, courses: [c])
    > c.teachers << Teacher.first
    > c.save


#### Avoid Dropbox Authentication Locally

Rewrite `#current_user` to return the user you want to be:

[app/controllers/application_controller.rb](https://github.com/plusjade/makeist/blob/804d177c6b047cc455cbe531df861ec8c0b79098/app/controllers/application_controller.rb#L30-L33)

**Teacher**
```ruby
def current_user
  return Teacher.first # <--- return a teacher and you are a teacher!
  return nil unless session[:user_id]
  @current_user ||= User.where(id: session[:user_id]).first
end
```

**Student**
```ruby
def current_user
  return Student.first # <--- return a student and you are a student!
  return nil unless session[:user_id]
  @current_user ||= User.where(id: session[:user_id]).first
end
```


#### Start the App

    $ rails s

and you're all set on <http://localhost:3000/>
