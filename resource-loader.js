//������ȡ����

	var base = 'pal/';		//��ǰĿ¼
	var files = [
		['sss.mkf', 5],			//��������
		['pat.mkf', 9],			//��ɫ��
		['wor16.asc'],			//���
		//['wor16.fon', 0],		//�����ֿ�
		['jianti.fon', 0],		//�����ֿ�
		['word.dat'],			//����

		['fbp.mkf', 72],		//����ͼ

		['map.mkf', 226],		//��ͼ
		['gop.mkf', 226],		//ͼԪ
		['mgo.mkf', 637],		//��ɫ
		['rgm.mkf', 92],		//ͷ��
		['m.msg', 0],			//�Ի�����

		['data.mkf'],			//������
		['abc.mkf'],			//
		['ball.mkf'],			//��Ʒ��
		//['map.bin.mkf'];
	];


/*  load resource */

	var file_caches = {};		//key -> Uint8Array

	//��ǰ������Ҫ����Դ�ļ�, ��ֹ��������ͬ���첽����
	function ready(callback) {
		console.log('init ready start');

		var queue = Queue.create();

		for(var i = 0; i < files.length; i++) {

			(function(c) {
				queue.add(function() {
					loadUrl(files[c][0], function(byteArray, url) {
						save(url, byteArray);
						queue.remove();
					}, c);
				});
			})(i);
		}

		queue.finish(callback);
	}

	function load(url) {
		var file = file_caches[url];
		if (!file) {
			alert('δ���� ' + url);
			return;
		}
		return file;
	}

	function save(url, byteArray) {
		file_caches[url] = byteArray;
	}



	//ajax load
	function loadUrl(url, callback, id) {
		var spanId = 'info-p' + id;
		document.getElementById('info').innerHTML += '<li>�������� : ' + url + ' <span id="'+spanId+'">';
		console.log('����������Դ�ļ� : ' + url + ' ');

		var ajax = Lang.ajaxByteArray(url, function(ret, url) {
			//document.getElementById('info').innerHTML += '������� (' + ret.length + ')';
			console.log('������� ' + url + '(' + ret.length + ')');
			return callback && callback(ret, url);
		});
		ajax.addEventListener('progress', function(ev) {
			document.getElementById(spanId).innerHTML = '(' + Math.ceil(ev.loaded/ev.total*10000) / 100 + '%)'
		})
	}
	
	/**************    load Mkf file  ***********/
	var loadMkfCount = 0;

	//�ɽ���mkf�����ʽ
	function loadMkf(file, index) {
		var data = load(file);
		var start = data.getInt(index * 4);
		var end = data.getInt(index * 4 + 4);
			
		//console.log('read mkf ' + (loadMkfCount++) + ' : ' + file + ' ' + index + ' -> ' + toHex4(start) + ' ' + toHex4(end));

		if (end-start > 655360) {
			//alert('overflow : ' + file + ' ' + index + ' ' + (end-start));
			return ;
		}

		return data.slice(start, end);		//��������ͼ
	}




