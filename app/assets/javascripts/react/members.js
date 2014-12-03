var Members = React.createClass({
    displayName: 'Members'
    ,
    getDefaultProps: function() {
        return { students: [] };
    }
    ,
    render: function() {
        var nodes = this.props.students.map(function(a, i) {
            return React.DOM.div(
                        {
                            key: a.id
                        }
                        , React.DOM.img({ src: a.avatar })
                        , React.DOM.input({ value: a.name })
                   );
        }, this);

        return React.DOM.div(null
            , React.DOM.h3(null, this.props.students.length + ' Total Members')
            , React.DOM.div({ className: 'members-wrap' }, nodes)
        );
    }
});
Members = React.createFactory(Members);
