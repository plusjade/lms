var Attendance = React.createClass({
    displayName: 'Attendance'
    ,
    getDefaultProps: function() {
        return { attendances: [] };
    }
    ,
    render: function() {
        var nodes, attended = 0;
        nodes = this.props.attendances.map(function(a, i) {
            if(a.attended) { attended++; }

            return React.DOM.div(
                        {
                            key: a.id,
                            className: a.attended ? 'student present' : 'student',
                            onClick : this.toggleStudent.bind(this, i)
                        }
                        , React.DOM.img({src: a.student_avatar })
                        , React.DOM.input({ value: a.student_name, readOnly: true })
                   );
        }, this);

        return React.DOM.div(null
            , React.DOM.h3(null
                , attended + ' of ' + this.props.attendances.length + ' attended - ('
                , (this.props.attendances.length - attended) + ' absent)'
            )
            , React.DOM.div({ className: 'members-wrap' }, nodes)
        );
    }
    ,
    toggleStudent : function(i) {
        this.props.attendances[i].attended = !this.props.attendances[i].attended;
        this.props.updateResponse({ attendances: this.props.attendances });

        $.ajax({
            type : "PUT",
            url: '/attendances/' + this.props.attendances[i].id ,
            data: {
                attended : this.props.attendances[i].attended,
                authenticity_token: this.props.CSRFTOKEN
            },
            dataType: "JSON"
        })
    }
});
Attendance = React.createFactory(Attendance);
