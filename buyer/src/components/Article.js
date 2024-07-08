const Article = () => {
    return (
      <section className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Article Title 1</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Brief description of the article content.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Article Title 2</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Brief description of the article content.</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Article Title 3</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Brief description of the article content.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Article;
  