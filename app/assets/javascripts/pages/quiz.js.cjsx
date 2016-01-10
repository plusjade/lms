@Quiz = React.createClass
  displayName: "Quiz"

  getInitialState: ->
    {
      index: @lastIndex()
    }

  lastIndex: ->
    @props.concept.quiz_questions.length - 1

  nextQuestion: ->
    next = @state.index - 1
    next_question = @props.concept.quiz_questions[next]
    if next_question
      @setState(index: next)
    else
      @setState(complete: true, refresh: undefined)

  handleRefresh: ->
    @setState(index: @lastIndex(), complete: false, refresh: true)

  render: ->
    complete_classes = ["complete"]
    complete_classes.push("on") if @state.complete

    questions =  _.map @props.concept.quiz_questions, (q, i) =>
      key =
      <Quiz.Question {...q}
        nextQuestion={@nextQuestion}
        key={q.id}
        active={i == @state.index}
        refresh={@state.refresh} />

    <div className="quiz-rcp">
      <div className={complete_classes.join(" ")}>
        <strong>SUCCESS!</strong> &mdash; <a href="#" onClick={@handleRefresh}>go again</a>
      </div>
      {questions}
    </div>

@Quiz.Question = React.createClass
  displayName: "Question"

  getInitialState: ->
    {
      misses: []
      answer_index: -1
    }

  componentWillReceiveProps: (nextProps) ->
    if nextProps.refresh && !@props.refresh # first sighting only
      @setState(misses: [], answer_index: -1)

  handleChoice: (choice, i) ->
    if !@answeredCorrectly()
      @checkChoice(choice, i)

  checkChoice: (choice, i) ->
    $.ajax(
      url: "/questions/#{@props.id}"
      type: "POST"
      dataType: "JSON"
      data:
        choice: choice
        authenticity_token: $("meta[name='csrf-token']").prop("content")
    ).done (rsp) =>
      @props.nextQuestion()
      @setState(answer_index: i)
    .fail () =>
      misses = @state.misses.slice()
      misses.push(i)
      @setState(misses: misses)

  answeredCorrectly: ->
    @state.answer_index >= 0

  render: ->
    choices = _.map @props.choices, (choice, i) =>
      if @answeredCorrectly()
        if @state.answer_index == i
          klass = "answer"
      else if (i in @state.misses)
        klass = "miss"
      <li
        onClick={@handleChoice.bind(@, choice, i)}
        key={i}
        className={klass}>{choice}</li>

    classes = ["rcp-question"]
    classes.push("correct") if @answeredCorrectly()
    classes.push("active") if @props.active

    <div className={classes.join(" ")}>
      <h4>{@props.question}</h4>
      <ul>{choices}</ul>
    </div>
