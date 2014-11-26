var Heading = React.createClass({
    displayName: 'Heading'
    ,
    render: function() {
        var lesson;
        if (this.props.lesson) {
            lesson = ('Lesson ' + parseInt(this.props.lesson.lesson) + ' - ' + this.props.lesson.date_human);
        }

        return React.DOM.h2(null
                , (this.props.course_name
                        ? React.DOM.a({ href: '/' }, this.props.course_name)
                        : null
                )
                , lesson
        );
    }
});
Heading = React.createFactory(Heading);
