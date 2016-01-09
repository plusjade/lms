@Tabs = React.createClass
  displayName: "Tabs"

  getDefaultProps: ->
    {
      tabNames: []
      course: {}
      user: {}
    }

  navigate: (key) ->
    @props.router.setRoute("#{@props.course.url}/#{key}")

  render: ->
    tabList = ["lessons"]

    if @props.course.calendar_embed
      tabList.push('calendar')
    tabList.push('students', 'attendances', 'website')

    tabs = [<li key="home"><a href="/">{@props.course.name}</a></li>]

    tabs = tabs.concat _.map tabList, (key) =>
      <li
        key={key}
        className={if @props.active == key then "active"}
        onClick={@navigate.bind(@, key)}
      >
        {@props.tabNames[key]}
      </li>

    <div className="primary-navigation">
      <ul className="nav-tabs">{tabs}</ul>
    </div>
