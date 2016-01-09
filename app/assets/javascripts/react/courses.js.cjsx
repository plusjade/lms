@Courses = React.createClass
  displayName: "Courses"

  getDefaultProps: ->
    { courses: [] }

  render: ->
    nodes = @props.courses.map (a, i) =>
      <li key={a.id}>
        <h4>{a.name}</h4>
        <Lessons lessons={a.lessons} />
      </li>

    <ul className="courses-wrap">
      {nodes}
    </ul>
