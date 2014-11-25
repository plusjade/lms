var Lessons = React.createClass({
    displayName: 'Lessons'
    ,
    getDefaultProps: function() {
        return { lessons: [] };
    }
    ,
    render: function() {
        var nodes = this.props.lessons.map(function(a, i) {
            return React.DOM.li(
                        {
                            key: a.id
                        }
                        , React.DOM.a({ href: '/lessons/' + a.id }
                                , React.DOM.span(null, 'Lesson ' + a.lesson)
                                , React.DOM.span(null, a.date_human)
                            )
                   );
        }, this);

        return React.DOM.ul({ className: 'lessons-wrap' }, nodes);
    }
});
Lessons = React.createFactory(Lessons);
