@ContentMixin =
  wrapContent: (primary, navigation) ->
    <div className={if @props.navOpen then "nav-open" else null}>
     <div className="navigation-content">{navigation}</div>
      <div className="primary-content">
        <div className="inner">{primary}</div>
      </div>
    </div>
