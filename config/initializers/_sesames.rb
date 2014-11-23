$sesames = File.join('config', 'sesames.json')
$sesames = File.open($sesames) {|f| JSON.parse(f.read) }
