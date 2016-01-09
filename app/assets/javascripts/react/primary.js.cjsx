@Primary = React.createClass
  displayName: "Primary"

  mixins : [ContentMixin]

  render: ->
    wrapContent = @wrapContent;

    props = _.extend(
            {},
            @props.tab,
            {
              key: @props.tab.key
              response: @props.response
              props: _.omit(@props, "response")
              handleResponse: @props.handleResponse
              loading: ->
                wrapContent(StatusMessage.loading())
              error: (response) ->
                wrapContent(StatusMessage.error(response))
            }
        )

    <AsyncLoader {...props} />
