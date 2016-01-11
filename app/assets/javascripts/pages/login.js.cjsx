@Login = React.createClass
  displayName: "Login"

  getInitialState: ->
    {
      user: {}
    }

  componentWillUpdate: (nextProps, nextState) ->
    if !@state.loaded && nextState.loaded
      gapi.load "auth2", =>
        @setState auth2: gapi.auth2.init(
          client_id: $("meta[name='google-signin-client_id']").prop("content")
        )
        if @state.user.email
          # user has a session so all good
        else
          # not signed in, if decides to sign in, monitor the state change.
          @state.auth2.isSignedIn.listen(@signInChanged)

  componentWillMount: ->
    @state.user = @props.user || {}

  signInChanged: (signed_in) ->
    if signed_in
      @appSignIn(@state.auth2.currentUser.get())
    else
      @appSignOut()

  appSignIn: (googleUser) ->
    id_token = googleUser.getAuthResponse().id_token
    $.ajax(
      url: '/google_auth_client'
      type: 'POST'
      dataType: 'JSON'
      data:
        token: id_token
        authenticity_token: $("meta[name='csrf-token']").prop("content")
      ).done (rsp) =>
        @setState(user: rsp.data.user)
        return
    return

  appSignOut: ->
    @setState(user: {})
    $.ajax
      url: '/logout'
      type: 'GET'

  sign_in: (e) ->
    e.preventDefault()
    if @state.auth2
      @state.auth2.signIn()
    else
      alert(
        "Google did not load properly." +
        "\n\nTry refreshing the page, or if you are running ad or social blocking software, " +
        "consider pausing the program in order to login."
      )

  sign_out: (e) ->
    e.preventDefault()
    @appSignOut()
    if @state.auth2
      @state.auth2.signOut()

  render: ->
    if @state.user.email
      link = <a href="/logout" onClick={@sign_out}>Logout</a>
    else
      link = <a href="#" onClick={@sign_in}>Sign in with Google</a>

    <ul>
      <li>{@state.user.name}</li>
      <li>{link}</li>
    </ul>
