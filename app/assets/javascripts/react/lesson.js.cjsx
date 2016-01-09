 @Lesson = React.createClass
    displayName: "Lesson"

    componentWillMount: ->
      @setActive("materials")

    getDefaultProps: ->
      {
        lesson: {}
      }

    renderTabs: (_tabs, _dict) ->
      tabs = _.map _tabs, (key) =>
        d = _dict[key]
        <li
          key={key}
          className={if @props.active == key then "active"}
          onClick={@setActive.bind(@, key)}
        >
          {d.name}
        </li>

      if @props.response
        active = _dict[@props.active]
        content = <AsyncLoader {...active}
                    key={active.key + '-sub'}
                    props={@props}
                    handleResponse={@handleNestedResponse}
                    response={@props.response}
                    loading={StatusMessage.loading}
                    error={StatusMessage.error}
                  />
      <div>
        <ul className="tabs">{tabs}</ul>
        <div className="tabs-content">{content}</div>
      </div>

    handleNestedResponse: (response) ->
      @props.updateResponse(response: response)

    updateResponse: (data) ->
      @props.updateResponse({
        response: _.extend({}, @props.response, data)
      })

    # Set viewable Tab
    # @param [String] key - The tab's key
    setActive: (key) ->
      @props.updateResponse({
          response: {
              status: "loading"
          },
          active: key
      });

    render: ->
      head = (
          <h3>
            <a href={"/lessons/#{@props.lesson.id}"}>
              {"Lesson #{@props.lesson.lesson} #{@props.lesson.date_human}"}
            </a>
          </h3>
      )

      dict =
        materials:
          key: "materials"
          name: "Materials"
          content: -> Materials
          endpoint: (props) ->
            "/lessons/#{props.lesson.id}/materials"
        feedback:
          key: "feedback"
          name: "My Feedback"
          content: -> Feedback
          endpoint : (props) ->
            "/students/#{props.user.id}/lessons/#{props.lesson.id}/feedback"
        feedbacks:
          key: "feedbacks"
          name: "Feedback Data"
          content: -> FeedbackData
          endpoint: (props) ->
            "/lessons/#{props.lesson.id}/feedbacks"
        attendances:
          key: "attendances"
          name: "Attendance"
          content: -> Attendance
          endpoint: (props) ->
            "/lessons/#{props.lesson.id}/attendances"

      tabs = ["materials"]
      switch @props.user.type
        when "Student"
          tabs.push("feedback")
          break
        when "Teacher"
          tabs.push('feedbacks', 'attendances')
          break

      <div>
        {head}
        {@renderTabs(tabs, dict)}
      </div>
