var Members = React.createClass({
    displayName: 'Members'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return { students: [] };
    }
    ,
    render: function() {
        var primary, nodes;

        nodes = this.props.students.map(function(a, i) {
            return React.DOM.div(
                        {
                            key: a.id
                        }
                        , React.DOM.img({ src: a.avatar })
                        , React.DOM.input({ value: a.name })
                   );
        }, this);

        primary = React.DOM.div(null
            , React.DOM.h3(null, this.props.students.length + ' Total Members')
            , React.DOM.div({ className: 'members-wrap' }, nodes)
        );

        return this.wrapContent(primary);
    }
});
Members = React.createFactory(Members);
