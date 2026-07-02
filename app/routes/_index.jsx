import {Link, useLoaderData} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Eco Stylish | Sustainable Style'},
    {
      name: 'description',
      content: 'Premium sustainable fashion made with care for the planet.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context}) {
  const [collectionsResult, productsResult] = await Promise.all([
    context.storefront.query(HOMEPAGE_COLLECTIONS_QUERY),
    context.storefront.query(HOMEPAGE_PRODUCTS_QUERY),
  ]);

  return {
    collections: collectionsResult.collections.nodes,
    products: productsResult.products.nodes,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const {collections, products} = useLoaderData();
  const heroImage = getHeroImage(collections, products);
  const storyImage = getStoryImage(collections, products);
  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(4, 10);
  const categoryCollections = buildCategories(collections, products);

  return (
    <div className="eco-home">
      <Hero image={heroImage} />
      <TrustRow />
      <CategorySection categories={categoryCollections} />
      <ProductSection
        eyebrow="Curated essentials"
        title="Featured Collection"
        products={featuredProducts}
      />
      <StoryBanner image={storyImage} />
      <ProductSection
        eyebrow="Fresh from the studio"
        title="New Arrivals"
        products={newArrivals.length ? newArrivals : featuredProducts}
        compact
      />
      <ImpactSection />
      <CommunitySection products={featuredProducts} />
    </div>
  );
}

function Hero({image}) {
  return (
    <section className="eco-hero">
      <div className="eco-hero-copy">
        <p className="eco-kicker">Thoughtful fashion, naturally made</p>
        <h1>Sustainable Style. Better for the Planet.</h1>
        <p>
          Thoughtful fashion made with care for people and the planet. Soft
          textures, lasting silhouettes, and everyday pieces with a lighter
          footprint.
        </p>
        <div className="eco-actions">
          <Link className="eco-button eco-button-primary" to="/collections/all">
            Shop Now
          </Link>
          <Link className="eco-button eco-button-secondary" to="/collections">
            Explore Collection
          </Link>
        </div>
      </div>
      <div className="eco-hero-media">
        {image ? (
          <Image
            data={image}
            alt={image.altText || 'Sustainable lifestyle product'}
            sizes="(min-width: 900px) 48vw, 100vw"
            loading="eager"
          />
        ) : (
          <div className="eco-image-fallback" />
        )}
      </div>
    </section>
  );
}

function TrustRow() {
  const items = [
    ['01', 'Sustainable Materials', 'Organic, recycled, and responsibly sourced'],
    ['02', 'Ethical Production', 'Fair wages and mindful working conditions'],
    ['03', 'Fast Shipping', 'Reliable delivery with carbon-aware partners'],
    ['04', 'Easy Returns', 'Simple exchanges and stress-free returns'],
    ['05', 'Eco Packaging', 'Reusable, recyclable, and plastic-light mailers'],
  ];

  return (
    <section className="eco-trust" aria-label="Store benefits">
      {items.map(([number, title, text]) => (
        <article className="eco-trust-card" key={title}>
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

function CategorySection({categories}) {
  return (
    <section className="eco-section eco-categories">
      <div className="eco-section-heading">
        <p className="eco-kicker">Shop by category</p>
        <h2>Designed for every quiet ritual.</h2>
      </div>
      <div className="eco-category-grid">
        {categories.map((category) => (
          <Link
            className="eco-category-card"
            key={category.title}
            to={category.to}
          >
            {category.image ? (
              <Image
                data={category.image}
                alt={category.image.altText || category.title}
                sizes="(min-width: 900px) 25vw, 50vw"
                loading="lazy"
              />
            ) : (
              <div className="eco-image-fallback" />
            )}
            <span>{category.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductSection({compact = false, eyebrow, products, title}) {
  if (!products.length) return null;

  return (
    <section className={`eco-section ${compact ? 'eco-section-compact' : ''}`}>
      <div className="eco-section-heading eco-heading-row">
        <div>
          <p className="eco-kicker">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <Link className="eco-text-link" to="/collections/all">
          View All Products
        </Link>
      </div>
      <div className="eco-product-grid">
        {products.map((product, index) => (
          <EcoProductCard
            key={product.id}
            product={product}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
    </section>
  );
}

function EcoProductCard({loading, product}) {
  const variant = product.selectedOrFirstAvailableVariant;
  const image = getProductImage(product);

  return (
    <article className="eco-product-card">
      <Link className="eco-product-image" to={`/products/${product.handle}`}>
        {image ? (
          <Image
            data={image}
            alt={image.altText || product.title}
            aspectRatio="4/5"
            loading={loading}
            sizes="(min-width: 900px) 24vw, (min-width: 600px) 50vw, 100vw"
          />
        ) : (
          <div className="eco-image-fallback" />
        )}
        <span>Quick View</span>
      </Link>
      <div className="eco-product-details">
        <Link to={`/products/${product.handle}`}>{product.title}</Link>
        <Money data={product.priceRange.minVariantPrice} />
      </div>
      <AddToCartButton
        disabled={!variant?.availableForSale}
        lines={
          variant
            ? [
                {
                  merchandiseId: variant.id,
                  quantity: 1,
                  selectedVariant: variant,
                },
              ]
            : []
        }
      >
        {variant?.availableForSale ? 'Quick Add' : 'Sold Out'}
      </AddToCartButton>
    </article>
  );
}

function StoryBanner({image}) {
  return (
    <section className="eco-story">
      <div className="eco-story-media">
        {image ? (
          <Image
            data={image}
            alt={image.altText || 'Nature inspired sustainable fashion'}
            sizes="(min-width: 900px) 50vw, 100vw"
            loading="lazy"
          />
        ) : (
          <div className="eco-image-fallback" />
        )}
      </div>
      <div className="eco-story-copy">
        <p className="eco-kicker">Our philosophy</p>
        <h2>Good for People. Better for the Planet.</h2>
        <p>
          Sustainable fashion that respects nature and craftsmanship. Every
          piece is chosen for comfort, longevity, and lower-impact living.
        </p>
        <Link className="eco-button eco-button-primary" to="/pages/about">
          Discover More
        </Link>
      </div>
    </section>
  );
}

function ImpactSection() {
  const stats = [
    ['10,000+', 'Orders shipped with mindful packaging'],
    ['3,200+', 'Lower-impact materials selected'],
    ['50+', 'Artisan and ethical production partners'],
  ];

  return (
    <section className="eco-impact">
      <p className="eco-kicker">Our impact</p>
      <h2>Small choices, softer footprints.</h2>
      <div className="eco-impact-grid">
        {stats.map(([value, label]) => (
          <div key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommunitySection({products}) {
  const reviews = products.slice(0, 3);
  if (!reviews.length) return null;

  return (
    <section className="eco-section eco-community">
      <div className="eco-section-heading">
        <p className="eco-kicker">Loved by our community</p>
        <h2>Quiet pieces with lasting character.</h2>
      </div>
      <div className="eco-community-grid">
        {reviews.map((product) => (
          <article key={product.id}>
            {getProductImage(product) && (
              <Image
                data={getProductImage(product)}
                alt={getProductImage(product).altText || product.title}
                aspectRatio="1/1"
                sizes="90px"
                loading="lazy"
              />
            )}
            <p>
              The quality feels thoughtful and easy to wear. It has become a
              calm staple in my everyday wardrobe.
            </p>
            <strong>{product.title}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function getHeroImage(collections, products) {
  return (
    collections.find((collection) => collection.image)?.image ||
    getProductImage(products.find((product) => getProductImage(product)))
  );
}

function getStoryImage(collections, products) {
  return (
    collections.find((collection, index) => index > 0 && collection.image)
      ?.image ||
    getProductImage(products.find((product, index) => index > 1 && getProductImage(product))) ||
    getHeroImage(collections, products)
  );
}

function buildCategories(collections, products) {
  const fallbackTitles = ['Women', 'Men', 'Accessories', 'Home & Living'];
  const collectionCategories = collections
    .filter((collection) => collection.image)
    .slice(0, 4)
    .map((collection) => ({
      title: collection.title,
      to: `/collections/${collection.handle}`,
      image: collection.image,
    }));

  if (collectionCategories.length >= 4) return collectionCategories;

  const productImages = products
    .map((product) => getProductImage(product))
    .filter(Boolean);

  return fallbackTitles.map((title, index) => ({
    title: collectionCategories[index]?.title || title,
    to: collectionCategories[index]?.to || '/collections/all',
    image: collectionCategories[index]?.image || productImages[index],
  }));
}

function getProductImage(product) {
  if (!product) return null;

  return (
    product.featuredImage ||
    product.images?.nodes?.[0] ||
    product.media?.nodes?.find((media) => media.previewImage)?.previewImage ||
    null
  );
}

const HOMEPAGE_COLLECTIONS_QUERY = `#graphql
  query HomepageCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  fragment HomepageProduct on Product {
    id
    title
    handle
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 3) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    media(first: 3) {
      nodes {
        previewImage {
          id
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    selectedOrFirstAvailableVariant {
      id
      availableForSale
      product {
        title
        handle
      }
      image {
        id
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
    }
  }
  query HomepageProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...HomepageProduct
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
