@Gateway = React.createClass
  displayName: "Gateway"

  propTypes:
    course: React.PropTypes.object.isRequired
    user: React.PropTypes.object.isRequired
    CSRFTOKEN: React.PropTypes.string.isRequired

  componentDidMount: ->
    # Setup routing
    @props.router.on(
      'courses/:id', @setLesson.bind(null, null)
    )
    @props.router.on(
      'courses/:id/lessons', @setLesson.bind(null, null)
    )
    @props.router.on(
      'courses/:id/students', @setActive.bind(null, 'students')
    )
    @props.router.on(
      'courses/:id/attendances', @setActive.bind(null, 'attendances')
    )
    @props.router.on(
      'courses/:id/calendar', @setActive.bind(null, 'calendar')
    )
    @props.router.on(
      'courses/:id/website', @setActive.bind(null, 'website')
    )
    @props.router.on(
      'lessons/:id', @setLesson
    )

    @props.router.init()

  getInitialState: ->
    {}

  TabsDictionary:
    lessons:
      key: "lessons"
      name: "Lessons"
      content: -> Lessons
      async: (update, props) ->
        update({
          status: 'success',
          lessons: props.course.lessons
        })
    calendar:
      key: "calendar"
      name: "Calendar"
      content: -> Calendar
      async: (update, props) ->
        update({
          status: "success",
          embed_url: props.course.calendar_embed
        })
    students:
      key: "students"
      name: "Members"
      content: -> Members
      endpoint: (props) ->
        props.course.url + '/students'
    attendances:
      key: 'attendances'
      name: 'Attendance'
      content: -> Attendances
      endpoint: (props) ->
        props.course.url + '/attendances'
    website:
        key:"website"
        name: "My Website"
        content: -> Website
        async: (update, props) ->
          update({
            status: 'success',
            user: props.user
          })

  handleResponse: (response) ->
    @setState(response: response)

  updateResponse: (data) ->
    @setState({
      response: _.extend({}, @state.response, data)
    });

  # Set active tab
  # @param [String] key - The tab's key
  setActive: (key) ->
    @setState({ active: key, response: null })

  # Set a particular lesson
  setLesson: (id) ->
    lesson = if id then _.findWhere(@props.course.lessons, { id: id }) else @props.bootStrappedLesson
    @setState({
      active: 'lessons',
      lesson: lesson
    })

  render: ->
    tabNames = {}
    for key of @TabsDictionary
      tabNames[key] = @TabsDictionary[key].name

    tabs = <Tabs {...@props} active={@state.active} tabNames={tabNames} />

    if @state.active
      props =  _.extend(
                  {},
                  @props,
                  _.omit(@state, "active"),
                  {
                      tab : @TabsDictionary[@state.active],
                      response : @state.response,
                      handleResponse : @handleResponse,
                      updateResponse : @updateResponse
                  }
              )
      primary = <Primary {...props} />

    <div>
      {tabs}
      {primary}
    </div>
