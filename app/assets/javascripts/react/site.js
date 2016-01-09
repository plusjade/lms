var Site = React.createClass({
    displayName: 'Site'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return {
            pending: false,
            bucketName: "narly.io",
            defaultDomain: "http://fewd-24-john-simmons.s3-website-us-east-1.amazonaws.com",
            customDomain: "http://narly.io",
            redirects: ["http://www.narly.io"],
            files: [
                {
                    "name" : "index.html",
                    "size" : "128kb",
                    "content-type" : "text/html", 
                    "cache-control" : "no-cache",
                    "last modified" : "Mon Oct 29 GMT"
                }
                ,
                {
                    "name" : "app.js",
                    "size" : "128kb",
                    "content-type" : "application/javascript", 
                    "cache-control" : "no-cache",
                    "last modified" : "Mon Oct 29 GMT"
                }
            ]
        };
    }
    ,
    render: function() {
        console.log(this.props);
        var primary, button, response;
        var files = [];
        var path = '';

        if (this.props.content) {
            files = this.props.content.site.files;
            path = this.props.content.site.path;

            if (this.props.loaded === 'error') {
                response = StatusMessage.error(this.props.content);
            }
            else {
                response = React.DOM.div({ className: 'success'}
                    , 'Success! Your website has been published to: '
                    , React.DOM.a({ href: this.props.content.endpoint, target: '_blank' }
                        , this.props.content.endpoint
                    )
                )
            }
        }

        var domainLinks;
        var domains = [
            { name: "default domain", domain: this.props.defaultDomain },
            { name: "custom domain", domain: this.props.customDomain },
            { name: "redirect domain", domain: this.props.redirects[0] }
        ];

        domainLinks = domains.map(function(d) {
                    return React.DOM.tr(null
                            , React.DOM.td(null, d.name)
                            , React.DOM.td(null
                                , React.DOM.a({
                                        className: 'website-link',
                                        href: d.domain,
                                        target: '_blank'
                                    }
                                    , d.domain
                                )
                            )
                        )
                })

        var head = [], fileRows = [];
        var names = ["name", "content_length", "content_type", "cache_control", "last_modified"];

        head = names.map(function(name) {
                return React.DOM.th(null, name)
            });


        fileRows = files.map(function(d){
            return React.DOM.tr(null
                , names.map(function(name) {
                    var value;
                    value = (name === 'name')
                                ? d.name.replace(new RegExp('^' + path), '')
                                : d[name]
                    ;

                    if(name === 'name' && d.type === 'folder') {
                        return React.DOM.td(null
                            , React.DOM.a({
                                    href: "?path="+ d.name,
                                    onClick: this.handleClick.bind(this, d.name)
                                }
                                , value
                            )
                        )
                    }
                    else {
                        return React.DOM.td(null, value)
                    }
                }, this)
            )
        }, this);

        var breadcrumbs = [];
        var pieces = _.compact(path.split('/'));
        breadcrumbs = pieces.map(function(p) {
                    var i = pieces.indexOf(p);
                    var path = pieces.slice(0, i+1).join('/');

                    return React.DOM.a({
                            href: "?path="+ path,
                            onClick: this.handleClick.bind(this, path)
                        }
                        , p
                    )
                }, this)
        breadcrumbs.unshift(
            React.DOM.a({
                    href: "?path=/",
                    onClick: this.handleClick.bind(this, "/")
                }
                , 'Base'
            )
        )


        var drop = React.DOM.div({
                            id: 'drop-interface',
                            onDrop: function(event) {
                                event.preventDefault();
                                console.log('dropped!');
                                return false;
                            }
                        }
                        //, React.DOM.span(null, "Drag files here!")
                    );

        primary = React.DOM.div({ className: 'site-wrap' }
            , React.DOM.h3(null, this.props.bucketName)
            , React.DOM.table({ className: 'domains' }
                , React.DOM.tbody(null, domainLinks)
            )
            , React.DOM.h3(null, 'Files')
            , React.DOM.div({ className: 'breadcrumbs' }
                , breadcrumbs
            )
            , React.DOM.table({ className: 'files' }
                , React.DOM.thead(null, React.DOM.tr(null, head))
                , React.DOM.tbody(null, fileRows)
            )
            , React.DOM.h3(null, 'Upload')
            , drop
        );

        return this.wrapContent(primary);
    }
    ,
    handleClick : function(path, event) {
        event.preventDefault();
        var updateResponse = this.props.updateResponse;

        //updateResponse({ pending: true, content: null });

        $.ajax({
            type : "GET",
            url: "/website?path=" + path,
            data: {
                authenticity_token: this.props.CSRFTOKEN
            },
            dataType: "JSON"
        })
        .done(function(rsp) {
            updateResponse({
                pending: false,
                content: rsp
            });
        })
        .error(function(xhr) {
            var content = {
                status: xhr.status,
                error: xhr.statusText
            }
            if(xhr.responseJSON) {
                content.error = xhr.responseJSON.error;
            }

            updateResponse({
                pending: false,
                loaded: 'error',
                content: content
            });
        })
    }
});
Site = React.createFactory(Site);
