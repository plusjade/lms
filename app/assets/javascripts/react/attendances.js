var Attendances = React.createClass({
    displayName: 'Attendances'
    ,
    mixins: [SortMixin, ContentMixin]
    ,
    getDefaultProps: function() {
        return { students: [], lessons: [] };
    }
    ,
    render: function() {
        var primary, nodes, attended = 0, totals, thead, rows = [], th=[], td=[], totalsRow;

        totals = this.createRow(_.extend({
                                    id: '_total', name: 'Total' }
                                    , this.props.aggregate
                                )
                );

        nodes = this.sortNodes(this.props.students).map(function(a, i) {
                    var td = [];
                    a.attendances.forEach(function(lesson) {
                        td.push(
                            React.DOM.td({
                                    className: lesson ? 'on' : 'off'
                                }
                                , React.DOM.div()
                            )
                        )
                    })
                    rows.push(React.DOM.tr({ className: 'd' }, td))

                    a.total = a.attendances.length;
                    return this.createRow(a);
                }, this);

        this.props.lessons.forEach(function(l, i) {
            th.push(React.DOM.th({ title: l.date_human }, 'L ' + (i+1)));
            td.push(React.DOM.td(null
                    , React.DOM.div({ style: { height: l.percent + '%' } })
                    , React.DOM.span(null, React.DOM.em(null, l.percent + '%'))
                )
            );
        });

        thead = React.DOM.thead(null, React.DOM.tr(null, th));
        totalsRow = React.DOM.tr({ className: 'totals' }, td);

        primary = React.DOM.div(null
                , React.DOM.h3(null, 'Attendance Overview')
                , React.DOM.div({ className: 'attendences-wrap' }
                , React.DOM.div({ className: 'rows-wrap'}
                    , React.DOM.div({ className: 'sorters'}
                        , React.DOM.span({ onClick: this.sortHandler }, 'name')
                        , React.DOM.span({ onClick: this.sortHandler }, 'percent')
                    )
                    , totals
                    , nodes
                )
                , React.DOM.div({className: 'data-wrap'}
                    , React.DOM.table(null
                        , thead
                        , React.DOM.tbody(null
                            , totalsRow
                            , rows
                        )
                    )
                )
            )
        );

        return this.wrapContent(primary);
    }
    ,
    createRow : function(a) {
        return React.DOM.div({
                    key: a.id,
                    className: 'row'
                }
                , React.DOM.div({ className: 'user' }
                    , (a.avatar ? React.DOM.img({src: a.avatar }) : null)
                    , React.DOM.div(null, a.name)
                )
                , React.DOM.div({ className: 'summary' }
                    , React.DOM.span({
                            className: 'percent'
                        }
                        , (a.percent || 0) + '%')
                    , React.DOM.span({
                            className: 'total'
                        }, (a.attended || 0) + '/' + a.total
                    )
                )
            );
    }
    ,
    updatePrimaryContent : function(data) {
        MK.Nav.setState({ payload : _.extend({}, this.props, data) });
    }
});
Attendances = React.createFactory(Attendances);
