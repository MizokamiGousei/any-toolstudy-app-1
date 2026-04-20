import { DayCurriculum } from '@/types';

export const day1: DayCurriculum = {
  dayId: 1,
  title: 'Cursorの世界へようこそ',
  description: 'Cursorのインストールから基本操作まで、AI搭載エディタの第一歩を踏み出そう',
  emoji: '🚀',
  quests: [
    {
      id: 'day1-quest1',
      dayId: 1,
      title: 'Cursorをインストールしよう',
      description: 'Cursorをダウンロードしてインストールし、初回起動まで完了しよう',
      difficulty: 1,
      estimatedMinutes: 10,
      targetRoles: 'all',
      steps: [
        {
          title: 'Cursor公式サイトにアクセス',
          content: 'cursor.com にアクセスして「Download」ボタンをクリック',
        },
        {
          title: 'インストーラーをダウンロード',
          content: 'お使いのOS（Mac/Windows/Linux）に合ったインストーラーを選択',
        },
        {
          title: 'インストールを実行',
          content: 'ダウンロードしたファイルを開いてインストール手順に従う',
        },
        {
          title: '初回起動',
          content: 'Cursorを起動して、必要に応じてVS Codeの設定をインポート',
        },
      ],
      challenge: 'Cursorを起動して、ウェルカム画面が表示されることを確認しよう',
      hints: [
        'VS Codeユーザーは設定のインポートを選択すると便利',
        'M1/M2 Macの場合はApple Silicon版を選択',
      ],
      checkQuestions: [
        {
          question: 'Cursorはどのエディタをベースにしていますか？',
          options: ['Vim', 'VS Code', 'Sublime Text', 'Atom'],
          correctIndex: 1,
          explanation: 'CursorはVS Codeをベースに、AI機能を統合したエディタです',
        },
      ],
    },
    {
      id: 'day1-quest2',
      dayId: 1,
      title: '画面を探検しよう',
      description: 'Cursorの画面構成を理解し、各パネルの役割を把握しよう',
      difficulty: 1,
      estimatedMinutes: 15,
      targetRoles: 'all',
      steps: [
        {
          title: 'サイドバーを確認',
          content: '左側のサイドバーでファイルエクスプローラー、検索、Git等のアイコンを確認',
        },
        {
          title: 'エディタエリア',
          content: '中央のメインエリアでファイルを開いて編集できる',
        },
        {
          title: 'ターミナル',
          content: '下部のターミナルパネル（Ctrl+`で開閉）',
        },
        {
          title: 'AIチャットパネル',
          content: '右側のCursorチャットパネル（Cmd+L / Ctrl+L）を開いてみよう',
        },
        {
          title: 'コマンドパレット',
          content: 'Cmd+Shift+P / Ctrl+Shift+Pでコマンドパレットを開く',
        },
      ],
      challenge: 'チャットパネル、ターミナル、ファイルエクスプローラーをそれぞれ開閉してみよう',
      hints: [
        'パネルはドラッグでサイズ変更できる',
        'Cmd+Bでサイドバーの表示/非表示を切り替え',
      ],
      checkQuestions: [
        {
          question: 'CursorのAIチャットを開くショートカットは？',
          options: ['Cmd+K', 'Cmd+L', 'Cmd+J', 'Cmd+I'],
          correctIndex: 1,
          explanation: 'Cmd+L（Ctrl+L）でAIチャットパネルを開きます',
        },
      ],
    },
    {
      id: 'day1-quest3',
      dayId: 1,
      title: 'AIに初めて話しかけよう',
      description: 'CursorのAIチャット機能を使って、初めての対話を体験しよう',
      difficulty: 1,
      estimatedMinutes: 10,
      targetRoles: 'all',
      steps: [
        {
          title: 'チャットパネルを開く',
          content: 'Cmd+LでAIチャットパネルを開く',
        },
        {
          title: '質問を入力',
          content: '「こんにちは、あなたは何ができますか？」と入力してEnter',
        },
        {
          title: '応答を確認',
          content: 'AIの回答を読んで、できることを理解する',
        },
        {
          title: '追加質問',
          content: '「Cursorの便利な機能を3つ教えて」と聞いてみよう',
        },
      ],
      challenge: 'AIに3つ以上の異なる質問をして、会話を続けてみよう',
      hints: [
        '日本語で質問できる',
        '具体的に質問するほど良い回答が得られる',
      ],
      checkQuestions: [
        {
          question: 'AIチャットに送信するキーは？',
          options: ['Cmd+Enter', 'Enter', 'Shift+Enter', 'Tab'],
          correctIndex: 1,
          explanation: 'Enterキーでメッセージを送信します。Shift+Enterで改行です',
        },
      ],
    },
    {
      id: 'day1-quest4',
      dayId: 1,
      title: 'ファイルを作ってみよう',
      description: 'Cursorでファイルを作成し、AIの助けを借りてコンテンツを生成しよう',
      difficulty: 2,
      estimatedMinutes: 15,
      targetRoles: 'all',
      steps: [
        {
          title: '新しいフォルダを作成',
          content: '任意の場所に練習用フォルダを作り、Cursorで開く',
        },
        {
          title: '新しいファイルを作成',
          content: 'エクスプローラーで右クリック→新しいファイル→hello.txtを作成',
        },
        {
          title: '内容を入力',
          content: '"Hello, Cursor!" と入力して保存（Cmd+S）',
        },
        {
          title: 'HTMLファイルを作成',
          content: 'index.htmlを作り、AIに「基本的なHTMLテンプレートを作って」と頼む',
        },
        {
          title: 'AIの提案を適用',
          content: '提案されたコードをファイルに反映する',
        },
      ],
      challenge: 'AIの助けを借りて、自己紹介ページのHTMLファイルを作成しよう',
      hints: [
        'Cmd+Nで新しいファイルを素早く作成',
        '言語モードは右下のステータスバーで変更可能',
      ],
      checkQuestions: [
        {
          question: 'ファイルを保存するショートカットは？',
          options: ['Cmd+S', 'Cmd+D', 'Cmd+F', 'Cmd+P'],
          correctIndex: 0,
          explanation: 'Cmd+S（Ctrl+S）でファイルを保存します',
        },
      ],
    },
    {
      id: 'day1-quest5',
      dayId: 1,
      title: 'キーボードショートカットを覚えよう',
      description: '効率的に作業するための基本的なキーボードショートカットをマスターしよう',
      difficulty: 2,
      estimatedMinutes: 10,
      targetRoles: 'all',
      steps: [
        {
          title: '基本操作',
          content: 'Cmd+S（保存）、Cmd+Z（元に戻す）、Cmd+Shift+Z（やり直し）',
        },
        {
          title: '検索',
          content: 'Cmd+F（ファイル内検索）、Cmd+Shift+F（プロジェクト全体検索）',
        },
        {
          title: 'ファイル操作',
          content: 'Cmd+P（ファイルを素早く開く）、Cmd+W（タブを閉じる）',
        },
        {
          title: 'AI関連',
          content: 'Cmd+L（チャット）、Cmd+K（インライン編集）、Cmd+I（Composer）',
        },
        {
          title: '練習',
          content: '実際にショートカットを5回ずつ使ってみよう',
        },
      ],
      challenge: '5つ以上のショートカットを使いこなせるようになろう',
      hints: [
        'Cmd+K,Sでショートカット一覧を表示',
        'よく使うものから覚えるのがコツ',
      ],
      checkQuestions: [
        {
          question: 'プロジェクト全体を検索するショートカットは？',
          options: ['Cmd+F', 'Cmd+Shift+F', 'Cmd+P', 'Cmd+G'],
          correctIndex: 1,
          explanation: 'Cmd+Shift+F（Ctrl+Shift+F）でプロジェクト全体を検索できます',
        },
      ],
    },
    {
      id: 'day1-quest6',
      dayId: 1,
      title: '設定をカスタマイズしよう',
      description: 'Cursorの設定を自分好みにカスタマイズして、快適な開発環境を作ろう',
      difficulty: 2,
      estimatedMinutes: 15,
      targetRoles: 'all',
      steps: [
        {
          title: '設定を開く',
          content: 'Cmd + ,（カンマ）で設定画面を開く',
        },
        {
          title: 'テーマを変更',
          content: 'Color Themeを検索してお好みのテーマに変更',
        },
        {
          title: 'フォントサイズ',
          content: 'Editor: Font Sizeを好みの大きさに調整',
        },
        {
          title: 'AI設定',
          content: 'Cursor固有の設定（Cursor Settings）を確認',
        },
        {
          title: '自動保存',
          content: 'Auto Saveを「afterDelay」に設定して作業効率アップ',
        },
      ],
      challenge: 'テーマとフォントサイズを自分好みに設定しよう',
      hints: [
        'settings.jsonを直接編集することもできる',
        'Cmd+K, Cmd+Tでテーマを素早く変更',
      ],
      checkQuestions: [
        {
          question: '設定画面を開くショートカットは？',
          options: ['Cmd+.', 'Cmd+,', 'Cmd+;', 'Cmd+:'],
          correctIndex: 1,
          explanation: 'Cmd+,（Ctrl+,）で設定画面を開きます',
        },
      ],
    },
  ],
};
