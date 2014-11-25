var Materials = React.createClass({
    displayName: 'Materials'
    ,
    getDefaultProps: function() {
        return { materials: {} };
    }
    ,
    render: function() {
        var nodes, dlAll;
        if(this.props.materials.contents) {
            nodes = this.props.materials.contents.map(function(a, i) {
                return React.DOM.li(
                            {
                                key: a.path
                            }
                            , React.DOM.img({ src: "https://s3.amazonaws.com/makeist.com/app/dropbox-api-icons/48x48/" + a.icon + "48.gif" })
                            , React.DOM.span(null, a.path)
                            , (a.bytes ? React.DOM.i(null, a.size) : null)
                            , React.DOM.a({ href: a.dl, target: '_blank' }
                                , 'download'
                            )
                        )
            }, this);
        }
        else {
            nodes = React.DOM.li(null, 'No files found')
        }

        dlAll = this.props.materials.dl
                    ? React.DOM.a({ href: this.props.materials.dl, target: '_blank', className: 'button' }, 'download all' )
                    : null
        ;

        return React.DOM.div({ className: 'materials-wrap' }
            , React.DOM.h4(null
                , this.props.materials.path
                , dlAll
            )
            , React.DOM.ul(null, nodes)
        );
    }
});
Materials = React.createFactory(Materials);
