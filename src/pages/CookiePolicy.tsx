
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="py-8 px-2 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose prose-sm md:prose-base max-w-none">
        <p className="text-muted-foreground mb-4">Last updated: May 18, 2025</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your browser 
            and allows the service or a third-party to recognize you and make your next visit easier and the service more useful to you.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. How We Use Cookies</h2>
          <p>
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Authentication - We use cookies to identify you when you visit our application</li>
            <li>Security - We use cookies to help identify and prevent security risks</li>
            <li>Preferences - We use cookies to remember information about how you prefer the application to behave and look</li>
            <li>Analysis - We use cookies to help us to analyze the use and performance of our application</li>
            <li>Functionality - We use cookies to enable us to personalize content for you</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Session Cookies: These cookies are temporary and expire once you close your browser</li>
            <li>Persistent Cookies: These cookies remain on your device until you delete them or they expire</li>
            <li>Essential Cookies: Necessary for the operation of our application</li>
            <li>Analytical/Performance Cookies: Allow us to recognize and count the number of visitors and analyze website traffic</li>
            <li>Functionality Cookies: Enable us to personalize content for you</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the application and 
            deliver advertisements on and through the application.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Controlling Cookies</h2>
          <p>
            Most browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to 
            set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you 
            from saving customized settings like login information.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page 
            and updating the "Last updated" date.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at privacy@lunatales.com.
          </p>
        </section>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default CookiePolicy;
