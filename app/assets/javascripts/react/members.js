var Members = React.createClass({
    displayName: 'Members'
    ,
    getDefaultProps: function() {
        return { students: [] };
    }
    ,
    render: function() {
        var nodes = this.props.students.map(function(a, i) {
            return React.DOM.li(
                        {
                            key: a.id
                        }
                        , a.name
                   );
        }, this);

        return React.DOM.div(null
            , React.DOM.h3(null, this.props.students.length + ' Total Members')
            , React.DOM.ol({ className: 'members-wrap' }, nodes)
        );
    }
});
Members = React.createFactory(Members);
