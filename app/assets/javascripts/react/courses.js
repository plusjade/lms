var Courses = React.createClass({
    displayName: 'Courses'
    ,
    getDefaultProps: function() {
        return { courses: [] };
    }
    ,
    render: function() {
        var nodes = this.props.courses.map(function(a, i) {
            return React.DOM.li(
                        {
                            key: a.id
                        }
                        , React.DOM.h4(null, a.name)
                        , Lessons({ lessons: a.lessons })
                   );
        }, this);

        return React.DOM.ul({ className: 'courses-wrap' }, nodes);
    }
});
Courses = React.createFactory(Courses);
