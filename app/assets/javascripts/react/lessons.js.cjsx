@Lessons = React.createClass
  displayName: "Lessons"

  mixins: [ContentMixin]

  getDefaultProps: ->
    { lessons: [], navOpen: true }

  loadLesson: (index) ->
    if @props.lessons[index]
      @props.router.setRoute(@props.lessons[index].url)

  toggle: ->
    @props.updateResponse({ navOpen: !@props.navOpen })

  render: ->
    toggler = <svg
                className="navToggler"
                viewBox="5.0 -10.0 100 120"
                onClick={@toggle}
              >
                <polygon points="53.75,10 93.375,50 53,90 53,70 73.75,50 53.875,30"></polygon>
                <polygon points="18.75,10 58.375,50 18,90 18,70 38.75,50 18.875,30"></polygon>
              </svg>

    if @props.lesson
      lessonView = <Lesson {...@props} key={@props.lesson.id}/> # @props is the parent's async response

     primary =  <div id="lesson-wrap">
                  {toggler}
                  {lessonView}
                </div>

    nodes = @props.lessons.map (a, i) =>
      if @props.lesson && a.id == @props.lesson.id
        classes = "active"
        active =  <svg viewBox="5.0 -10.0 90 125">
                    <path d="M79.674,53.719c2.59-2.046,2.59-5.392,0-7.437L22.566,1.053C19.977-0.993,18,0.035,18,3.335v93.331    c0,3.3,1.977,4.326,4.566,2.281L79.674,53.719z"/>
                  </svg>

      <li
        key={a.id}
        className={classes}
        onClick={@loadLesson.bind(@, i)}
      >
        <span>{active}</span>
        <span>{a.lesson}. </span>
        <span>{a.title}</span>
        <sup>{a.date_human}</sup>
      </li>

    navigation = <ul>{nodes}</ul>

    @wrapContent(primary, navigation)

